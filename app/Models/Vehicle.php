<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vehicle extends Model
{
    protected $fillable = [
        'name', 'model', 'plate_num', 'year', 'status', 'driver_id', 'recent_mileage', 'present_in', 'present_out'
    ];

    /**
     * Get the driver assigned to this vehicle.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}