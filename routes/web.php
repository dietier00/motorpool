<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DriverController;
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

Route::get('/dashboard', function () {
    return inertia('Dashboard/Index', [
        'stats' => [
            'total'       => \App\Models\Vehicle::count(),
            'active'      => \App\Models\Vehicle::where('status', 'active')->count(),
            'maintenance' => \App\Models\Vehicle::where('status', 'maintenance')->count(),
            'available'   => \App\Models\Vehicle::where('status', 'available')->count(),
        ],
        'vehicles' => \App\Models\Vehicle::latest()->take(5)->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return inertia('Dashboard/Index', [
            'stats' => [
                'total'       => \App\Models\Vehicle::count(),
                'active'      => \App\Models\Vehicle::where('status', 'active')->count(),
                'maintenance' => \App\Models\Vehicle::where('status', 'maintenance')->count(),
                'available'   => \App\Models\Vehicle::where('status', 'available')->count(),
            ],
            'vehicles' => \App\Models\Vehicle::latest()->take(5)->get(),
        ]);
    })->name('dashboard');

    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');

    Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');
    Route::post('/drivers', [DriverController::class, 'store'])->name('drivers.store');
    Route::put('/drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
    Route::delete('/drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');
    Route::get('/drivers/{driver}', [DriverController::class, 'show'])->name('drivers.show');

    Route::get('/maintenance', [\App\Http\Controllers\MaintenanceController::class, 'index'])->name('maintenance.index');
    Route::get('/history', [\App\Http\Controllers\HistoryController::class, 'index'])->name('history.index');
    Route::get('/reports', [\App\Http\Controllers\ReportsController::class, 'index'])->name('reports.index');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/vehicle/{id}/scan', [VehicleController::class, 'scan'])->name('vehicles.scan');
Route::get('/vehicle/{id}/pdf',  [VehicleController::class, 'pdf'])->name('vehicles.pdf');

require __DIR__.'/auth.php';