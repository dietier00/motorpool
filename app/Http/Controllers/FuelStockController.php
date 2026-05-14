<?php

namespace App\Http\Controllers;

use App\Models\FuelStock;
use Illuminate\Http\Request;

class FuelStockController extends Controller
{
    public function index()
    {
        $stocks = FuelStock::all()->map(function ($stock) {
            return [
                'id' => $stock->id,
                'fuel_type' => $stock->fuel_type,
                'current_stock' => $stock->current_stock,
                'threshold' => $stock->threshold,
                'avg_price_per_liter' => $stock->avg_price_per_liter,
                'is_low' => $stock->isLow(),
                'restock_cost_to_threshold' => $stock->restockCost($stock->threshold * 2), // restock to double threshold
            ];
        });

        return response()->json($stocks);
    }

    public function update(Request $request, FuelStock $fuelStock)
    {
        $data = $request->validate([
            'current_stock' => 'numeric|min:0',
            'threshold' => 'numeric|min:0',
            'avg_price_per_liter' => 'numeric|min:0',
        ]);

        $fuelStock->update($data);

        return response()->json(['message' => 'Fuel stock updated successfully']);
    }

    public function restock(Request $request, FuelStock $fuelStock)
    {
        $data = $request->validate([
            'liters' => 'required|numeric|min:0.1',
            'price_per_liter' => 'numeric|min:0',
        ]);

        $fuelStock->add($data['liters']);

        // Update average price if provided
        if (isset($data['price_per_liter'])) {
            $fuelStock->avg_price_per_liter = $data['price_per_liter'];
            $fuelStock->save();
        }

        return response()->json(['message' => 'Fuel restocked successfully']);
    }
}
