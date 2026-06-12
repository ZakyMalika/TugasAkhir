<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an Admin user
        User::firstOrCreate(
            ['email' => 'admin@luxedrive.com'],
            [
                'name' => 'LuxeDrive Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // Create a Standard User
        User::firstOrCreate(
            ['email' => 'user@luxedrive.com'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );
    }
}
