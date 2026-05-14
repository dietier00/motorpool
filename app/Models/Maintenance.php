<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    protected $table = 'maintenance';

    protected $guarded = [];

    protected $casts = [
        'service_date' => 'date',
        'next_due_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
