<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        // Simple listing: join history with vehicles and drivers
        $query = History::with(['vehicle', 'driver'])->latest();

        $history = $query->paginate(12)->withQueryString();

        // Map to a lightweight structure for the frontend
        $trips = $history->through(function ($item) {
            return [
                'id' => 'H-' . $item->id,
                'driver' => $item->driver?->name,
                'vehicle' => $item->vehicle?->name . ' (' . ($item->vehicle?->plate_num ?? '') . ')',
                'start' => $item->recent_inspection?->format('Y-m-d') ?? null,
                'end' => $item->recent_maintenance?->format('Y-m-d') ?? null,
                'distance' => null,
                'purpose' => 'Record',
            ];
        });

        return Inertia::render('History', [
            'trips' => $trips,
            'pagination' => [
                'total' => $history->total(),
            ],
        ]);
    }
}
