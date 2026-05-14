<?php

namespace Database\Seeders;

use App\Models\FuelLog;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FuelLogSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = Vehicle::all();
        $drivers = Driver::all();
        if ($vehicles->isEmpty() || $drivers->isEmpty()) {
            return;
        }

        // Generate data for the last 6 months
        for ($i = 0; $i < 100; $i++) {
            $vehicle = $vehicles->random();
            $driver = $drivers->random();
            $date = Carbon::now()->subDays(rand(0, 180));
            $liters = rand(20, 60);
            $pricePerLiter = rand(50, 70);

            FuelLog::create([
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
                'date' => $date,
                'odometer_reading' => rand(10000, 50000),
                'liters' => $liters,
                'price_per_liter' => $pricePerLiter,
                'fuel_type' => 'Diesel',
                'station' => 'Station ' . rand(1, 10),
                'notes' => 'Refuel',
            ]);
        }
    }
}