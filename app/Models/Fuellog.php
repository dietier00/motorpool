<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuelLog extends Model
{
    protected $fillable = [
        'vehicle_id', 'driver_id', 'date', 'odometer_reading',
        'liters', 'price_per_liter', 'fuel_type',
        'station', 'km_driven', 'efficiency', 'cost_per_km', 'notes',
    ];

    protected $casts = [
        'date'             => 'date',
        'odometer_reading' => 'decimal:2',
        'liters'           => 'decimal:2',
        'price_per_liter'  => 'decimal:2',
        'total_cost'       => 'decimal:2',
        'km_driven'        => 'decimal:2',
        'efficiency'       => 'decimal:2',
        'cost_per_km'      => 'decimal:2',
    ];

    // ── Relationships ──────────────────────────────
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function driver()  { return $this->belongsTo(Driver::class); }

    // ── Auto-compute on save ───────────────────────
    protected static function booted(): void
    {
        static::creating(function (FuelLog $log) {
            static::computeFields($log);
        });

        static::updating(function (FuelLog $log) {
            static::computeFields($log);
        });
    }

    private static function computeFields(FuelLog $log): void
    {
        // Get the previous fuel log for this vehicle
        $prev = static::where('vehicle_id', $log->vehicle_id)
            ->where('id', '!=', $log->id ?? 0)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->first();

        if ($prev && $log->odometer_reading > $prev->odometer_reading) {
            $log->km_driven   = round($log->odometer_reading - $prev->odometer_reading, 2);
            $log->efficiency  = $log->liters > 0
                ? round($log->km_driven / $log->liters, 2)
                : null;
            $log->cost_per_km = $log->km_driven > 0
                ? round(($log->liters * $log->price_per_liter) / $log->km_driven, 2)
                : null;
        }
    }
}