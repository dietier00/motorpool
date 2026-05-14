<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\FuelLogController;
use App\Http\Controllers\MaintenanceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

$dashboardData = function () {
    $stats = [
        'total'       => \App\Models\Vehicle::count(),
        'active'      => \App\Models\Vehicle::where('status', 'active')->count(),
        'maintenance' => \App\Models\Vehicle::where('status', 'maintenance')->count(),
        'available'   => \App\Models\Vehicle::where('status', 'available')->count(),
    ];

    $vehicles = \App\Models\Vehicle::where('status', 'available')->latest()->take(6)->get();

    $trendStart = now()->subMonths(5)->startOfMonth();
    $trendMonths = collect(range(0, 5))->map(function ($offset) use ($trendStart) {
        return $trendStart->copy()->addMonths($offset);
    });

    $trendLabels = $trendMonths->map(function ($date) {
        return $date->format('M');
    })->all();

    $indexByMonth = [];
    foreach ($trendMonths as $index => $date) {
        $indexByMonth[$date->format('Y-m')] = $index;
    }

    $maintenanceTrend = array_fill(0, count($trendLabels), 0);
    $inspectionTrend = array_fill(0, count($trendLabels), 0);
    $fuelTrend = array_fill(0, count($trendLabels), 0);

    $trendEnd = now()->endOfMonth();

    // Query actual maintenance records
    $maintenanceRecords = \App\Models\Maintenance::where('service_type', 'maintenance')
        ->whereBetween('service_date', [$trendStart, $trendEnd])
        ->get(['service_date']);

    $inspectionRecords = \App\Models\Maintenance::where('service_type', 'inspection')
        ->whereBetween('service_date', [$trendStart, $trendEnd])
        ->get(['service_date']);

    $fuelRecords = \App\Models\FuelLog::whereBetween('date', [$trendStart, $trendEnd])
        ->get(['date']);

    // Populate maintenance trend
    foreach ($maintenanceRecords as $record) {
        $monthKey = \Illuminate\Support\Carbon::parse($record->service_date)->format('Y-m');
        if (isset($indexByMonth[$monthKey])) {
            $maintenanceTrend[$indexByMonth[$monthKey]] += 1;
        }
    }

    // Populate inspection trend
    foreach ($inspectionRecords as $record) {
        $monthKey = \Illuminate\Support\Carbon::parse($record->service_date)->format('Y-m');
        if (isset($indexByMonth[$monthKey])) {
            $inspectionTrend[$indexByMonth[$monthKey]] += 1;
        }
    }

    // Populate fuel trend
    foreach ($fuelRecords as $record) {
        $monthKey = \Illuminate\Support\Carbon::parse($record->date)->format('Y-m');
        if (isset($indexByMonth[$monthKey])) {
            $fuelTrend[$indexByMonth[$monthKey]] += 1;
        }
    }

    $history = \App\Models\History::with(['vehicle', 'driver'])->latest()->take(10)->get();
    $activityPool = collect();

    foreach ($history as $record) {
        $vehicleName = trim(($record->vehicle->name ?? '') . ' ' . ($record->vehicle->model ?? ''));
        $plate = $record->vehicle->plate_num ?? null;
        $driver = $record->driver->name ?? null;

        $metaParts = array_filter([
            $vehicleName ?: null,
            $plate ? 'Plate ' . $plate : null,
            $driver ? 'Driver ' . $driver : null,
        ]);

        $meta = $metaParts ? implode(' | ', $metaParts) : 'Vehicle activity update';

        if ($record->recent_maintenance) {
            $activityPool->push([
                'date' => \Illuminate\Support\Carbon::parse($record->recent_maintenance),
                'title' => 'Maintenance completed',
                'meta' => $meta,
                'tone' => 'warning',
                'icon' => 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
            ]);
        }

        if ($record->recent_inspection) {
            $activityPool->push([
                'date' => \Illuminate\Support\Carbon::parse($record->recent_inspection),
                'title' => 'Inspection recorded',
                'meta' => $meta,
                'tone' => 'info',
                'icon' => 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            ]);
        }

        if ($record->recent_fuel) {
            $fuelMeta = $meta;
            if (!is_null($record->fuel_cost)) {
                $fuelMeta .= ' | Fuel cost ' . number_format((float) $record->fuel_cost, 2);
            }

            $activityPool->push([
                'date' => \Illuminate\Support\Carbon::parse($record->recent_fuel),
                'title' => 'Fuel replenished',
                'meta' => $fuelMeta,
                'tone' => 'success',
                'icon' => 'M13 10V3L4 14h7v7l9-11h-7z',
            ]);
        }
    }

    $activities = $activityPool
        ->sortByDesc('date')
        ->take(6)
        ->map(function ($item) {
            return [
                'title' => $item['title'],
                'meta' => $item['meta'],
                'time' => $item['date']->format('M d, Y'),
                'tone' => $item['tone'],
                'icon' => $item['icon'],
            ];
        })
        ->values()
        ->all();

    return [
        'stats' => $stats,
        'vehicles' => $vehicles,
        'serviceTrends' => [
            'labels' => $trendLabels,
            'maintenance' => $maintenanceTrend,
            'inspection' => $inspectionTrend,
            'fuel' => $fuelTrend,
        ],
        'activities' => $activities,
    ];
};

Route::get('/dashboard', function () use ($dashboardData) {
    return inertia('Dashboard/Index', $dashboardData());
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');

    Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');
    Route::post('/drivers', [DriverController::class, 'store'])->name('drivers.store');
    Route::put('/drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
    Route::delete('/drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');
    Route::get('/drivers/{driver}', [DriverController::class, 'show'])->name('drivers.show');

    Route::get('/fuel',              [FuelLogController::class, 'index'])->name('fuel.index');
    Route::post('/fuel',             [FuelLogController::class, 'store'])->name('fuel.store');
    Route::put('/fuel/{fuelLog}',    [FuelLogController::class, 'update'])->name('fuel.update');
    Route::delete('/fuel/{fuelLog}', [FuelLogController::class, 'destroy'])->name('fuel.destroy');

    Route::get('/fuel-stocks',              [\App\Http\Controllers\FuelStockController::class, 'index'])->name('fuel-stocks.index');
    Route::put('/fuel-stocks/{fuelStock}',  [\App\Http\Controllers\FuelStockController::class, 'update'])->name('fuel-stocks.update');
    Route::post('/fuel-stocks/{fuelStock}/restock', [\App\Http\Controllers\FuelStockController::class, 'restock'])->name('fuel-stocks.restock');

    Route::get('/maintenance', [MaintenanceController::class, 'index'])->name('maintenance.index');
    Route::post('/maintenance', [MaintenanceController::class, 'store'])->name('maintenance.store');
    Route::put('/maintenance/{maintenance}', [MaintenanceController::class, 'update'])->name('maintenance.update');
    Route::delete('/maintenance/{maintenance}', [MaintenanceController::class, 'destroy'])->name('maintenance.destroy');
    Route::get('/history', [\App\Http\Controllers\HistoryController::class, 'index'])->name('history.index');
    Route::get('/reports', [\App\Http\Controllers\ReportsController::class, 'index'])->name('reports.index');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/vehicle/{id}/scan', [VehicleController::class, 'scan'])->name('vehicles.scan');
Route::get('/vehicle/{id}/pdf',  [VehicleController::class, 'pdf'])->name('vehicles.pdf');

require __DIR__.'/auth.php';