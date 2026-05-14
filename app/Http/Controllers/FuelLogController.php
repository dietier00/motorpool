<?php

namespace App\Http\Controllers;

use App\Models\FuelLog;
use App\Models\Vehicle;
use App\Models\FuelStock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FuelLogController extends Controller
{
    public function index(Request $request)
    {
        $query = FuelLog::with(['vehicle', 'driver'])
            ->orderByDesc('date')
            ->orderByDesc('id');

        if ($request->vehicle_id) {
            $query->where('vehicle_id', $request->vehicle_id);
        }
        if ($request->fuel_type) {
            $query->where('fuel_type', $request->fuel_type);
        }
        if ($request->from) {
            $query->whereDate('date', '>=', $request->from);
        }
        if ($request->to) {
            $query->whereDate('date', '<=', $request->to);
        }

        $logs = $query->paginate(15)->withQueryString();

        // ── Summary stats ──────────────────────────────────
        $allLogs = FuelLog::with('vehicle')
            ->when($request->vehicle_id, fn($q) => $q->where('vehicle_id', $request->vehicle_id))
            ->get();

        $totalLiters    = $allLogs->sum('liters');
        $totalCost      = $allLogs->sum(fn($l) => $l->liters * $l->price_per_liter);
        $avgEfficiency  = $allLogs->whereNotNull('efficiency')->avg('efficiency');
        $avgCostPerKm   = $allLogs->whereNotNull('cost_per_km')->avg('cost_per_km');

        // ── Monthly chart data (last 6 months) ────────────
        $monthly = FuelLog::selectRaw("
                DATE_FORMAT(date, '%Y-%m') as month,
                SUM(liters) as total_liters,
                SUM(liters * price_per_liter) as total_cost,
                AVG(efficiency) as avg_efficiency
            ")
            ->where('date', '>=', now()->subMonths(6))
            ->when($request->vehicle_id, fn($q) => $q->where('vehicle_id', $request->vehicle_id))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // ── Per-vehicle efficiency (for anomaly detection) ─
        $fleetAvgEfficiency = FuelLog::whereNotNull('efficiency')->avg('efficiency');
        $vehicleEfficiency = FuelLog::selectRaw('vehicle_id, AVG(efficiency) as avg_eff, COUNT(*) as fill_count')
            ->whereNotNull('efficiency')
            ->groupBy('vehicle_id')
            ->with('vehicle:id,plate_num,name,model')
            ->get()
            ->map(fn($v) => [
                'vehicle'    => $v->vehicle?->plate_num . ' ' . $v->vehicle?->name,
                'avg_eff'    => round($v->avg_eff, 2),
                'fill_count' => $v->fill_count,
                'is_low'     => $v->avg_eff < ($fleetAvgEfficiency * 0.85), // 15% below fleet avg
            ]);

        return Inertia::render('Fuel/Index', [
            'logs'              => $logs,
            'vehicles'          => Vehicle::select('id', 'plate_num', 'name', 'model')->orderBy('plate_num')->get(),
            'filters'           => $request->only(['vehicle_id', 'fuel_type', 'from', 'to']),
            'stats'             => [
                'total_liters'   => round($totalLiters, 2),
                'total_cost'     => round($totalCost, 2),
                'avg_efficiency' => round($avgEfficiency, 2),
                'avg_cost_per_km'=> round($avgCostPerKm, 2),
            ],
            'monthly'           => $monthly,
            'vehicle_efficiency'=> $vehicleEfficiency,
            'fleet_avg_eff'     => round($fleetAvgEfficiency, 2),
            'fuel_stocks'       => FuelStock::all()->map(fn($s) => [
                'id' => $s->id,
                'fuel_type' => $s->fuel_type,
                'current_stock' => $s->current_stock,
                'threshold' => $s->threshold,
                'avg_price_per_liter' => $s->avg_price_per_liter,
                'is_low' => $s->isLow(),
                'restock_cost_to_threshold' => $s->restockCost($s->threshold * 2),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vehicle_id'      => 'required|exists:vehicles,id',
            'driver_id'       => 'nullable|exists:drivers,id',
            'date'            => 'required|date',
            'odometer_reading'=> 'nullable|numeric|min:0',
            'liters'          => 'required|numeric|min:0.1',
            'price_per_liter' => 'required|numeric|min:0',
            'fuel_type'       => 'required|in:diesel,gasoline,premium',
            'station'         => 'nullable|string|max:150',
            'notes'           => 'nullable|string|max:500',
        ]);

        FuelLog::create($data);

        // Deduct from fuel stock
        $stock = FuelStock::where('fuel_type', $data['fuel_type'])->first();
        if ($stock) {
            $stock->deduct($data['liters']);
            // Update average price
            $avgPrice = FuelLog::where('fuel_type', $data['fuel_type'])
                ->where('date', '>=', now()->subDays(30))
                ->avg('price_per_liter');
            if ($avgPrice) {
                $stock->avg_price_per_liter = round($avgPrice, 2);
                $stock->save();
            }
        }

        return back()->with('success', 'Fuel log added successfully!');
    }

    public function update(Request $request, FuelLog $fuelLog)
    {
        $data = $request->validate([
            'vehicle_id'      => 'required|exists:vehicles,id',
            'driver_id'       => 'nullable|exists:drivers,id',
            'date'            => 'required|date',
            'odometer_reading'=> 'nullable|numeric|min:0',
            'liters'          => 'required|numeric|min:0.1',
            'price_per_liter' => 'required|numeric|min:0',
            'fuel_type'       => 'required|in:diesel,gasoline,premium',
            'station'         => 'nullable|string|max:150',
            'notes'           => 'nullable|string|max:500',
        ]);

        $oldLiters = $fuelLog->liters;
        $oldFuelType = $fuelLog->fuel_type;

        $fuelLog->update($data);

        // Adjust fuel stock
        if ($oldFuelType !== $data['fuel_type']) {
            // Fuel type changed, return to old stock and deduct from new
            $oldStock = FuelStock::where('fuel_type', $oldFuelType)->first();
            if ($oldStock) {
                $oldStock->add($oldLiters);
            }
            $newStock = FuelStock::where('fuel_type', $data['fuel_type'])->first();
            if ($newStock) {
                $newStock->deduct($data['liters']);
            }
        } else {
            // Same fuel type, adjust the difference
            $stock = FuelStock::where('fuel_type', $data['fuel_type'])->first();
            if ($stock) {
                $difference = $data['liters'] - $oldLiters;
                if ($difference > 0) {
                    $stock->deduct($difference);
                } else {
                    $stock->add(abs($difference));
                }
            }
        }

        // Update average price
        $stock = FuelStock::where('fuel_type', $data['fuel_type'])->first();
        if ($stock) {
            $avgPrice = FuelLog::where('fuel_type', $data['fuel_type'])
                ->where('date', '>=', now()->subDays(30))
                ->avg('price_per_liter');
            if ($avgPrice) {
                $stock->avg_price_per_liter = round($avgPrice, 2);
                $stock->save();
            }
        }

        return back()->with('success', 'Fuel log updated successfully!');
    }

    public function destroy(FuelLog $fuelLog)
    {
        // Return liters back to stock
        $stock = FuelStock::where('fuel_type', $fuelLog->fuel_type)->first();
        if ($stock) {
            $stock->add($fuelLog->liters);
        }

        $fuelLog->delete();
        return back()->with('success', 'Fuel log deleted.');
    }
}