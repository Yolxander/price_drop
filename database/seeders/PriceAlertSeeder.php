<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PriceAlert;
use App\Models\AlertSetting;
use App\Models\HotelBooking;
use App\Models\User;
use Carbon\Carbon;

class PriceAlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a demo user if it doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password'),
            ]
        );

        // Use existing hotel bookings instead of creating new ones
        $fairmont = HotelBooking::where('hotel_name', 'Fairmont Royal York')->first();
        $barcelona = HotelBooking::where('hotel_name', 'Hotel Arts Barcelona')->first();
        $tokyo = HotelBooking::where('hotel_name', 'Park Hyatt Tokyo')->first();

        // Create alert settings for the user
        AlertSetting::firstOrCreate(
            ['user_id' => $user->id],
            [
                'min_price_drop_amount' => 10.00,
                'min_price_drop_percent' => 5.00,
                'email_notifications' => true,
                'push_notifications' => true,
                'sms_notifications' => false,
                'notification_frequency' => 'immediate',
                'excluded_providers' => [],
                'included_locations' => []
            ]
        );

        // Create some sample price alerts using existing hotel bookings
        if ($fairmont) {
            PriceAlert::firstOrCreate(
                ['hotel_booking_id' => $fairmont->id],
                [
                    'hotel_booking_id' => $fairmont->id,
                    'user_id' => $user->id,
                    'hotel_name' => 'Fairmont Royal York',
                    'location' => 'Toronto, ON',
                    'provider' => 'Google Hotels',
                    'booked_price' => 1316.00,
                    'current_price' => 1184.00,
                    'delta_amount' => -132.00,
                    'delta_percent' => -10.0,
                    'currency' => 'USD',
                    'rule_threshold' => '>$50 drop',
                    'status' => 'new',
                    'severity' => 'high',
                    'triggered_at' => Carbon::now()->subHours(2),
                    'notes' => 'Price dropped significantly below threshold'
                ]
            );
        }

        if ($barcelona) {
            PriceAlert::firstOrCreate(
                ['hotel_booking_id' => $barcelona->id],
                [
                    'hotel_booking_id' => $barcelona->id,
                    'user_id' => $user->id,
                    'hotel_name' => 'Hotel Arts Barcelona',
                    'location' => 'Barcelona, Spain',
                    'provider' => 'Booking.com',
                    'booked_price' => 850.00,
                    'current_price' => 765.00,
                    'delta_amount' => -85.00,
                    'delta_percent' => -10.0,
                    'currency' => 'USD',
                    'rule_threshold' => '>5% drop',
                    'status' => 'actioned',
                    'severity' => 'medium',
                    'triggered_at' => Carbon::now()->subHours(1),
                    'notes' => 'Customer rebooked at lower price'
                ]
            );
        }

        if ($tokyo) {
            PriceAlert::firstOrCreate(
                ['hotel_booking_id' => $tokyo->id],
                [
                    'hotel_booking_id' => $tokyo->id,
                    'user_id' => $user->id,
                    'hotel_name' => 'Park Hyatt Tokyo',
                    'location' => 'Tokyo, Japan',
                    'provider' => 'Expedia',
                    'booked_price' => 150000.00,
                    'current_price' => 135000.00,
                    'delta_amount' => -15000.00,
                    'delta_percent' => -10.0,
                    'currency' => 'JPY',
                    'rule_threshold' => '>$1000 drop',
                    'status' => 'dismissed',
                    'severity' => 'high',
                    'triggered_at' => Carbon::now()->subHours(4),
                    'notes' => 'Customer decided to keep original booking'
                ]
            );
        }

        $this->command->info('Price alert data seeded successfully!');
    }
}
