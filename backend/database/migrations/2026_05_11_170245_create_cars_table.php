<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $col) {
            $col->id();
            $col->string('name');
            $col->string('brand');
            $col->string('category'); // Supercar, Luxury Sedan, SUV
            $col->decimal('price_per_day', 12, 2);
            $col->string('image_url')->nullable();
            $col->text('description')->nullable();
            $col->integer('horsepower')->nullable();
            $col->integer('top_speed')->nullable(); // in km/h
            $col->string('status')->default('available'); // available, rented, maintenance
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
