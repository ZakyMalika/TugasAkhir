<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::query();
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }
        $cars = $query->get();
        return response()->json([
            'status' => 'success',
            'data' => $cars
        ]);
    }

    public function store(\App\Http\Requests\StoreCarRequest $request)
    {
        $validated = $request->validated();
        $car = Car::create($validated);
        return response()->json([
            'status' => 'success',
            'message' => 'Car created successfully',
            'data' => $car
        ], 201);
    }

    public function show($id)
    {
        $car = Car::find($id);
        if (!$car) {
            return response()->json(['status' => 'error', 'message' => 'Car not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $car]);
    }

    public function update(\App\Http\Requests\UpdateCarRequest $request, $id)
    {
        $car = Car::find($id);
        if (!$car) {
            return response()->json(['status' => 'error', 'message' => 'Car not found'], 404);
        }

        $car->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Car updated successfully',
            'data' => $car
        ]);
    }

    public function destroy($id)
    {
        $car = Car::find($id);
        if (!$car) {
            return response()->json(['status' => 'error', 'message' => 'Car not found'], 404);
        }

        $activeReservations = \App\Models\Reservation::where('car_id', $id)
            ->whereIn('status', ['pending', 'approved', 'ongoing'])
            ->count();
            
        if ($activeReservations > 0) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Mobil tidak dapat dihapus karena masih memiliki pesanan aktif (Pending/Ongoing/Approved).'
            ], 400);
        }

        $car->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Car deleted successfully'
        ]);
    }
}
