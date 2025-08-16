<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DummyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a dummy user for hotel bookings
        User::create([
            'name' => 'Dummy User',
            'email' => 'dummy@hotelbookings.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
