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
        
        // Temporarily return HTML for QR code display
        $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vehicle Information</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .vehicle-info { border: 1px solid #ccc; padding: 20px; border-radius: 10px; max-width: 400px; margin: 0 auto; }
                h1 { color: #333; }
                p { margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class='vehicle-info'>
                <h1>Vehicle Information</h1>
                <p><strong>Name:</strong> {$vehicle->name}</p>
                <p><strong>Model:</strong> {$vehicle->model}</p>
                <p><strong>Plate Number:</strong> {$vehicle->plate_num}</p>
                <p><strong>Year:</strong> {$vehicle->year}</p>
                <p><strong>Status:</strong> {$vehicle->status}</p>
                <p><strong>Driver:</strong> " . ($vehicle->driver ? $vehicle->driver->name : 'None') . "</p>
                <p><strong>Recent Mileage:</strong> {$vehicle->recent_mileage}</p>
                <p><strong>Present In:</strong> {$vehicle->present_in}</p>
                <p><strong>Present Out:</strong> {$vehicle->present_out}</p>
            </div>
        </body>
        </html>
        ";
        
        return response($html)->header('Content-Type', 'text/html');
    }

    public function pdf($id)
    {
        $vehicle = \App\Models\Vehicle::with('driver')->findOrFail($id);
        $pdf = PDF::loadView('vehicle.pdf', compact('vehicle'));
        return $pdf->stream("vehicle-{$vehicle->plate_num}.pdf");
    }
}