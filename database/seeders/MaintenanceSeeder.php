<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = Vehicle::all();
        if ($vehicles->isEmpty()) {
            return;
        }

        $serviceTypes = ['maintenance', 'inspection'];
        $statuses = ['completed', 'scheduled', 'in_progress'];

        // Generate data for the last 6 months
        for ($i = 0; $i < 50; $i++) {
            $vehicle = $vehicles->random();
            $date = Carbon::now()->subDays(rand(0, 180));
            $serviceType = $serviceTypes[array_rand($serviceTypes)];
            $status = $statuses[array_rand($statuses)];

            Maintenance::create([
                'vehicle_id' => $vehicle->id,
                'service_type' => $serviceType,
                'service_date' => $date,
                'status' => $status,
                'mechanic' => 'Mechanic ' . rand(1, 5),
                'cost' => rand(500, 5000),
                'next_due_date' => $date->copy()->addMonths(rand(1, 6)),
            ]);
        }
    }
}