<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverController extends Controller
{
    /**
     * Display a listing of drivers.
     */
    public function index(Request $request)
    {
        $query = Driver::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('license_number', 'like', "%{$request->search}%")
                  ->orWhere('cp_number', 'like', "%{$request->search}%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('Drivers', [
            'drivers' => $query->latest()->paginate(12)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created driver.
     */
    public function store(StoreDriverRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('drivers', 'public');
        }

        Driver::create($data);

        return back()->with('success', 'Driver added successfully!');
    }

    /**
     * Display the specified driver.
     */
    public function show(Driver $driver)
    {
        return response()->json($driver->load('vehicles'));
    }

    /**
     * Update the specified driver.
     */
    public function update(UpdateDriverRequest $request, Driver $driver)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            if ($driver->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($driver->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($driver->image);
            }
            $data['image'] = $request->file('image')->store('drivers', 'public');
        }

        $driver->update($data);

        return back()->with('success', 'Driver updated successfully!');
    }

    /**
     * Remove the specified driver.
     */
    public function destroy(Driver $driver)
    {
        $driver->delete();

        return back()->with('success', 'Driver deleted successfully!');
    }
}
