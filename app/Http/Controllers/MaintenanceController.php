<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        // Show vehicles currently flagged for maintenance plus recent maintenance records
        $vehicles = Vehicle::where('status', 'maintenance')->get();
        $records = Maintenance::latest()->take(12)->get();

        return Inertia::render('Maintenance', [
            'vehicles' => $vehicles,
            'records' => $records,
        ]);
    }
}
