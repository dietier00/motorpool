<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF; // add near other imports (requires barryvdh/laravel-dompdf)

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::with('driver');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('plate_num', 'like', "%{$request->search}%")
                  ->orWhere('name', 'like', "%{$request->search}%")
                  ->orWhere('model', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $query->latest()->paginate(10)->withQueryString(),
            'drivers'  => Driver::where('status', 'active')->orderBy('name')->get(),
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_num' => 'required|string|unique:vehicles,plate_num',
            'name' => 'required|string|max:100',
            'model' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'status' => 'required|in:active,maintenance,available',
            'driver_id' => 'nullable|exists:drivers,id',
            'present_in' => 'nullable|integer|min:0',
            'present_out' => 'nullable|integer|min:0',
        ]);

        Vehicle::create($validated);

        return back()->with('success', 'Vehicle added successfully!');
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'plate_num' => 'required|string|unique:vehicles,plate_num,' . $vehicle->id,
            'name' => 'required|string|max:100',
            'model' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'status' => 'required|in:active,maintenance,available',
            'driver_id' => 'nullable|exists:drivers,id',
            'present_in' => 'nullable|integer|min:0',
            'present_out' => 'nullable|integer|min:0',
        ]);

        $vehicle->update($validated);

        return back()->with('success', 'Vehicle updated successfully!');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return back()->with('success', 'Vehicle deleted successfully!');
    }

    public function scan($id)
    {
        $vehicle = \App\Models\Vehicle::with('driver')->findOrFail($id);
        return view('vehicle.scan', compact('vehicle'));
    }

    public function pdf($id)
    {
        $vehicle = \App\Models\Vehicle::with('driver')->findOrFail($id);
        $pdf = PDF::loadView('vehicle.pdf', compact('vehicle'));
        return $pdf->stream("vehicle-{$vehicle->plate_num}.pdf");
    }
}