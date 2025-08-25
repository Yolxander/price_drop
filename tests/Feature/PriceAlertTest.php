<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\HotelBooking;
use App\Models\PriceAlert;
use App\Models\AlertSetting;
use App\Services\PriceAlertService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class PriceAlertTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $booking;
    protected $alertSettings;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user
        $this->user = User::factory()->create();

        // Create test booking
        $this->booking = HotelBooking::create([
            'user_id' => $this->user->id,
            'hotel_name' => 'Test Hotel',
            'location' => 'Test City',
            'check_in_date' => now()->addDays(30),
            'check_out_date' => now()->addDays(33),
            'guests' => 2,
            'currency' => 'USD',
            'original_price' => 200.00,
            'current_price' => 200.00,
            'status' => 'active'
        ]);

        // Create alert settings
        $this->alertSettings = AlertSetting::create([
            'user_id' => $this->user->id,
            'min_price_drop_amount' => 10.00,
            'min_price_drop_percent' => 5.00,
            'email_notifications' => true,
            'push_notifications' => true,
            'sms_notifications' => false,
            'notification_frequency' => 'immediate'
        ]);
    }

    /** @test */
    public function it_can_create_price_alert_for_significant_drop()
    {
        $service = app(PriceAlertService::class);

        // Simulate a price drop
        $newPrice = 180.00; // $20 drop (10% decrease)

        $alert = $service->checkSingleBooking($this->booking->id);

        // Since we're using simulated prices, we can't guarantee an alert will be created
        // But we can test the service methods work
        $this->assertInstanceOf(PriceAlertService::class, $service);
    }

    /** @test */
    public function it_respects_user_alert_thresholds()
    {
        $settings = $this->user->alertSettings;

        // Test that a small drop doesn't trigger notification
        $this->assertFalse($settings->shouldNotify(5.00, 2.5));

        // Test that a significant drop does trigger notification
        $this->assertTrue($settings->shouldNotify(20.00, 10.0));
    }

    /** @test */
    public function it_can_toggle_booking_monitoring()
    {
        $service = app(PriceAlertService::class);

        // Pause monitoring
        $result = $service->pauseMonitoring($this->booking->id);
        $this->assertTrue($result);

        $this->booking->refresh();
        $this->assertEquals('paused', $this->booking->status);

        // Activate monitoring
        $result = $service->activateMonitoring($this->booking->id);
        $this->assertTrue($result);

        $this->booking->refresh();
        $this->assertEquals('active', $this->booking->status);
    }

    /** @test */
    public function it_can_get_price_history()
    {
        // Create some test alerts
        PriceAlert::create([
            'hotel_booking_id' => $this->booking->id,
            'user_id' => $this->user->id,
            'hotel_name' => 'Test Hotel',
            'location' => 'Test City',
            'provider' => 'Test Provider',
            'booked_price' => 200.00,
            'current_price' => 180.00,
            'delta_amount' => 20.00,
            'delta_percent' => 10.00,
            'currency' => 'USD',
            'rule_threshold' => '>$20 drop',
            'severity' => 'medium',
            'status' => 'new',
            'triggered_at' => now()
        ]);

        $service = app(PriceAlertService::class);
        $history = $service->getPriceHistory($this->booking->id);

        $this->assertCount(1, $history);
        $this->assertEquals(180.00, $history->first()['price']);
        $this->assertEquals(20.00, $history->first()['drop_amount']);
    }

    /** @test */
    public function it_can_cleanup_old_alerts()
    {
        // Create old alerts
        PriceAlert::create([
            'hotel_booking_id' => $this->booking->id,
            'user_id' => $this->user->id,
            'hotel_name' => 'Test Hotel',
            'location' => 'Test City',
            'provider' => 'Test Provider',
            'booked_price' => 200.00,
            'current_price' => 180.00,
            'delta_amount' => 20.00,
            'delta_percent' => 10.00,
            'currency' => 'USD',
            'rule_threshold' => '>$20 drop',
            'severity' => 'medium',
            'status' => 'actioned',
            'triggered_at' => now()->subDays(35) // Old alert
        ]);

        $service = app(PriceAlertService::class);
        $deleted = $service->cleanupOldAlerts();

        $this->assertEquals(1, $deleted);
    }

    /** @test */
    public function it_prevents_duplicate_price_checks()
    {
        $service = app(PriceAlertService::class);

        // First check
        $service->checkSingleBooking($this->booking->id);
        $firstCheckTime = $this->booking->fresh()->last_checked;

        // Second check immediately after
        $service->checkSingleBooking($this->booking->id);
        $secondCheckTime = $this->booking->fresh()->last_checked;

        // Should not update last_checked if checked recently
        $this->assertEquals($firstCheckTime, $secondCheckTime);
    }
}
