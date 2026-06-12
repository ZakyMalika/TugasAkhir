<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable FK checks for MySQL compatibility
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('cars')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('cars')->insert([
            [
                'name' => 'Aventador SVJ',
                'brand' => 'Lamborghini',
                'category' => 'Supercar',
                'transmission' => 'Automatic',
                'price_per_day' => 25000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000',
                'description' => 'The pinnacle of Lamborghini performance, the SVJ combines extreme aerodynamics with a raw V12 heart.',
                'horsepower' => 770,
                'top_speed' => 350,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Huracán STO',
                'brand' => 'Lamborghini',
                'category' => 'Supercar',
                'transmission' => 'Automatic',
                'price_per_day' => 15000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1000',
                'description' => 'A road-legal super sports car inspired by the racing heritage of Lamborghini Squadra Corse.',
                'horsepower' => 640,
                'top_speed' => 310,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '488 Pista',
                'brand' => 'Ferrari',
                'category' => 'Supercar',
                'transmission' => 'Automatic',
                'price_per_day' => 22000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000',
                'description' => 'A track-focused beast with a twin-turbo V8 that screams Italian excellence.',
                'horsepower' => 710,
                'top_speed' => 340,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'SF90 Stradale',
                'brand' => 'Ferrari',
                'category' => 'Supercar',
                'transmission' => 'Automatic',
                'price_per_day' => 28000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000',
                'description' => 'The first ever Ferrari PHEV. A masterpiece of hybridization and pure power.',
                'horsepower' => 986,
                'top_speed' => 340,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ghost Black Badge',
                'brand' => 'Rolls-Royce',
                'category' => 'Luxury Sedan',
                'transmission' => 'Automatic',
                'price_per_day' => 35000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1631214524020-5e1f1019624b?auto=format&fit=crop&q=80&w=1000',
                'description' => 'The ultimate expression of post-opulent luxury. Silent, powerful, and intimidating.',
                'horsepower' => 592,
                'top_speed' => 250,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '911 GT3 RS',
                'brand' => 'Porsche',
                'category' => 'Supercar',
                'transmission' => 'Manual',
                'price_per_day' => 18000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000',
                'description' => 'Precision engineering at its finest. The GT3 RS is the ultimate drivers car.',
                'horsepower' => 518,
                'top_speed' => 296,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '720S Spider',
                'brand' => 'McLaren',
                'category' => 'Supercar',
                'transmission' => 'Automatic',
                'price_per_day' => 20000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1000',
                'description' => 'Light, strong, and incredibly fast. The 720S defines the modern supercar experience.',
                'horsepower' => 710,
                'top_speed' => 341,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Range Rover SV',
                'brand' => 'Land Rover',
                'category' => 'SUV',
                'transmission' => 'Automatic',
                'price_per_day' => 12000000.00,
                'image_url' => 'https://images.unsplash.com/photo-1606148344554-05561a3557e4?auto=format&fit=crop&q=80&w=1000',
                'description' => 'Luxury without boundaries. The Range Rover SV is as capable as it is comfortable.',
                'horsepower' => 606,
                'top_speed' => 261,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
