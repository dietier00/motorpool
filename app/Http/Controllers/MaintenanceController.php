<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = Vehicle::orderBy('name')->get([
            'id',
            'name',
            'model',
            'plate_num',
            'status',
        ]);

        $records = Maintenance::with('vehicle')
            ->orderByDesc('service_date')
            ->orderByDesc('created_at')
            ->take(50)
            ->get();

        return Inertia::render('Maintenance', [
            'vehicles' => $vehicles,
            'records' => $records,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateMaintenance($request);
        $maintenance = Maintenance::create($data);

        $this->syncVehicleStatus($maintenance);

        return redirect()->back();
    }

    public function update(Request $request, Maintenance $maintenance)
    {
        $data = $this->validateMaintenance($request);
        $maintenance->update($data);

        $this->syncVehicleStatus($maintenance);

        return redirect()->back();
    }

    public function destroy(Maintenance $maintenance)
    {
        $vehicle = $maintenance->vehicle;
        $maintenance->delete();

        if ($vehicle) {
            $openCount = Maintenance::where('vehicle_id', $vehicle->id)
                ->whereIn('status', ['scheduled', 'in_progress', 'overdue'])
                ->count();

            if ($openCount === 0 && $vehicle->status === 'maintenance') {
                $vehicle->update(['status' => 'available']);
            }
        }

        return redirect()->back();
    }

    private function validateMaintenance(Request $request): array
    {
        return $request->validate([
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'service_type' => ['required', 'string', 'max:120'],
            'service_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['scheduled', 'in_progress', 'completed', 'overdue'])],
            'mechanic' => ['required', 'string', 'max:120'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'next_due_date' => ['nullable', 'date', 'after_or_equal:service_date'],
        ]);
    }

    private function syncVehicleStatus(Maintenance $maintenance): void
    {
        $vehicle = $maintenance->vehicle ?? Vehicle::find($maintenance->vehicle_id);
        if (!$vehicle) {
            return;
        }

        if (in_array($maintenance->status, ['scheduled', 'in_progress', 'overdue'], true)) {
            $vehicle->update(['status' => 'maintenance']);
            return;
        }

        if ($maintenance->status === 'completed') {
            $openCount = Maintenance::where('vehicle_id', $maintenance->vehicle_id)
                ->where('id', '!=', $maintenance->id)
                ->whereIn('status', ['scheduled', 'in_progress', 'overdue'])
                ->count();

            if ($openCount === 0) {
                $vehicle->update(['status' => 'available']);
            }
        }
    }
}
