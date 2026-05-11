<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Fuel;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $total = Vehicle::count();
        $active = Vehicle::where('status', 'active')->count();
        $maintenance = Vehicle::where('status', 'maintenance')->count();

        // Monthly mileage approximation from fuel.present_out
        $miles = DB::table('fuel')
            ->selectRaw("DATE_FORMAT(date, '%b') as month, SUM(present_out) as total")
            ->groupBy('month')
            ->orderByRaw("MIN(date)")
            ->get()
            ->pluck('total', 'month');

        $categories = $miles->keys()->toArray();
        $series = [$miles->values()->toArray()];

        return Inertia::render('Reports', [
            'stats' => compact('total', 'active', 'maintenance'),
            'mileage' => [ 'categories' => $categories, 'series' => $series ],
        ]);
    }
}
