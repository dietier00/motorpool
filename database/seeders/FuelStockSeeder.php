<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FuelStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\FuelStock::create([
            'fuel_type' => 'diesel',
            'current_stock' => 1000,
            'threshold' => 200,
            'avg_price_per_liter' => 55.00,
        ]);

        \App\Models\FuelStock::create([
            'fuel_type' => 'gasoline',
            'current_stock' => 800,
            'threshold' => 150,
            'avg_price_per_liter' => 62.00,
        ]);

        \App\Models\FuelStock::create([
            'fuel_type' => 'premium',
            'current_stock' => 600,
            'threshold' => 100,
            'avg_price_per_liter' => 68.00,
        ]);

        \App\Models\FuelStock::create([
            'fuel_type' => 'unleaded',
            'current_stock' => 400,
            'threshold' => 80,
            'avg_price_per_liter' => 60.00,
        ]);
    }
}
