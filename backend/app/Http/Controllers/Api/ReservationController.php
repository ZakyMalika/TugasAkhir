<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Display a listing of reservations (Admin Only).
     */
    public function index(): JsonResponse
    {
        $reservations = Reservation::with(['user', 'car'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    /**
     * Store a newly created reservation in storage (Customer Only).
     */
    public function store(Request $request): JsonResponse
    {
        // Block admin accounts from making reservations (backend-level guard)
        if ($request->user()->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Administrator tidak diizinkan melakukan pemesanan mobil.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date_format:Y-m-d\TH:i|after_or_equal:now',
            'end_date' => 'required|date_format:Y-m-d\TH:i|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $car = Car::find($request->car_id);

        if ($car->status !== 'available') {
            return response()->json([
                'success' => false,
                'message' => 'Mobil tidak tersedia untuk disewa saat ini.'
            ], 400);
        }

        // Calculate rental days
        $start = Carbon::parse($request->start_date);
        $end = Carbon::parse($request->end_date);
        $days = ceil($start->diffInHours($end) / 24);
        if ($days < 1) $days = 1; // Minimum sewa 1 hari

        // Calculate prices
        $basePrice = $days * $car->price_per_day;
        $discount = 0.0;

        if ($days >= 7) {
            $discount = 0.20 * $basePrice; // 20% discount
        } elseif ($days >= 3) {
            $discount = 0.10 * $basePrice; // 10% discount
        }

        $securityDeposit = 15000000.00; // Flat Rp 15.000.000
        $totalPrice = $basePrice - $discount + $securityDeposit;

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'car_id' => $request->car_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pemesanan berhasil diajukan. Menunggu persetujuan admin.',
            'data' => $reservation->load(['car'])
        ], 201); // 201 Created
    }

    /**
     * Update the status of a reservation (Admin Only).
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:ongoing,approved,completed,cancelled,pending',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $reservation = Reservation::with(['car', 'user'])->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Data pemesanan tidak ditemukan.'
            ], 404);
        }

        $oldStatus = $reservation->status;
        $newStatus = $request->status;
        $car = $reservation->car;

        // Prevent approving/ongoing if the car is already rented by someone else
        if (($newStatus === 'ongoing' || $newStatus === 'approved') && $oldStatus !== 'ongoing' && $oldStatus !== 'approved') {
            if ($car->status !== 'available') {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menyetujui. Mobil ini sedang dalam masa sewa aktif oleh pelanggan lain.'
                ], 400);
            }
        }

        // Normalize approved to ongoing
        if ($newStatus === 'approved') {
            $newStatus = 'ongoing';
        }

        // Update reservation status
        $reservation->status = $newStatus;
        $reservation->save();

        // Manage car availability status automatically
        if ($newStatus === 'ongoing') {
            $car->status = 'rented';
            $car->save();
        } elseif (($newStatus === 'completed' || $newStatus === 'cancelled') && ($oldStatus === 'ongoing' || $oldStatus === 'approved')) {
            // Revert car status to available ONLY if it was previously approved/ongoing (occupying the car)
            $car->status = 'available';
            $car->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Status pemesanan berhasil diperbarui.',
            'data' => $reservation
        ]);
    }
}
