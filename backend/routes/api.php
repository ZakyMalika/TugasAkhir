<?php

use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Cars Route
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{id}', [CarController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Customer Reservation Route
    Route::post('/reservations', [ReservationController::class, 'store']);
    
    // Protected Admin Routes for Cars (CRUD)
    Route::middleware('isAdmin')->group(function () {
        Route::post('/cars', [CarController::class, 'store']);
        Route::put('/cars/{id}', [CarController::class, 'update']);
        Route::delete('/cars/{id}', [CarController::class, 'destroy']);
        
        // Admin Reservation Routes
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
        
        // Admin Dashboard Stats Route
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    });
});
