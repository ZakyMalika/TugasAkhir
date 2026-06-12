<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats(): JsonResponse
    {
        $totalCars = Car::count();
        $availableCars = Car::where('status', 'available')->count();
        $rentedCars = Car::where('status', 'rented')->count();
        
        $pendingBookings = Reservation::where('status', 'pending')->count();
        $approvedBookings = Reservation::whereIn('status', ['approved', 'ongoing'])->count();
        
        $totalRevenue = Reservation::where('status', 'completed')
                                   ->sum('total_price');

        return response()->json([
            'success' => true,
            'data' => [
                'total_cars' => $totalCars,
                'available_cars' => $availableCars,
                'rented_cars' => $rentedCars,
                'pending_bookings' => $pendingBookings,
                'approved_bookings' => $approvedBookings,
                'total_revenue' => $totalRevenue
            ]
        ], 200);
    }
}
