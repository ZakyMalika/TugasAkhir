<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::factory()->create([
            'name' => 'Admin Rental Jek',
            'email' => 'admin@rentaljek.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);

        // Create Customer User
        User::factory()->create([
            'name' => 'Customer Rental Jek',
            'email' => 'user@rentaljek.com',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        // Seed Car Data
        $this->call(CarSeeder::class);
    }
}
