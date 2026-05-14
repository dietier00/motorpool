<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuelStock extends Model
{
    protected $fillable = [
        'fuel_type', 'current_stock', 'threshold', 'avg_price_per_liter'
    ];

    protected $casts = [
        'current_stock' => 'decimal:2',
        'threshold' => 'decimal:2',
        'avg_price_per_liter' => 'decimal:2',
    ];

    // Method to deduct stock
    public function deduct($liters)
    {
        $this->current_stock = max(0, $this->current_stock - $liters);
        $this->save();
    }

    // Method to add stock
    public function add($liters)
    {
        $this->current_stock += $liters;
        $this->save();
    }

    // Check if stock is low
    public function isLow()
    {
        return $this->current_stock <= $this->threshold;
    }

    // Estimated cost to restock to a target level
    public function restockCost($targetLiters)
    {
        if (!$this->avg_price_per_liter) return null;
        $needed = max(0, $targetLiters - $this->current_stock);
        return round($needed * $this->avg_price_per_liter, 2);
    }
}
