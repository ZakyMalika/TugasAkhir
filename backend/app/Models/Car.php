<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Car extends Model
{
    protected $fillable = [
        'name',
        'brand',
        'category',
        'transmission',
        'price_per_day',
        'image_url',
        'description',
        'horsepower',
        'top_speed',
        'status',
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_ON_RENT = 'on_rent';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELED = 'canceled';
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_RENTED = 'rented';
    public const STATUS_MAINTENANCE = 'maintenance';

    /**
     * Scope to filter by status
     */
    public function scopeByStatus(Builder $query, string $status)
    {
        return $query->where('status', $status);
    }


    /**
     * Get the reservations for the car.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
