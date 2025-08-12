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
        Schema::table('hotel_bookings', function (Blueprint $table) {
            // Canonical hotel information
            $table->string('canonical_hotel_id')->nullable()->after('hotel_name');
            $table->string('canonical_hotel_name')->nullable()->after('canonical_hotel_id');
            $table->decimal('star_rating', 2, 1)->nullable()->after('canonical_hotel_name');
            $table->text('address')->nullable()->after('star_rating');
            $table->decimal('latitude', 10, 8)->nullable()->after('address');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            
            // Rate and policy information
            $table->decimal('base_rate', 10, 2)->nullable()->after('longitude');
            $table->decimal('taxes_fees', 10, 2)->nullable()->after('base_rate');
            $table->text('cancellation_policy')->nullable()->after('taxes_fees');
            $table->boolean('breakfast_included')->default(false)->after('cancellation_policy');
            
            // Amenities and facilities
            $table->json('amenities')->nullable()->after('breakfast_included');
            $table->json('facilities')->nullable()->after('amenities');
            
            // Room information
            $table->string('room_type')->nullable()->after('facilities');
            $table->string('room_code')->nullable()->after('room_type');
            $table->text('room_description')->nullable()->after('room_code');
            
            // Links and screenshots
            $table->text('booking_link')->nullable()->after('room_description');
            $table->text('hotel_website')->nullable()->after('booking_link');
            $table->json('screenshots')->nullable()->after('hotel_website');
            
            // Enrichment metadata
            $table->timestamp('enriched_at')->nullable()->after('screenshots');
            $table->boolean('enrichment_successful')->default(false)->after('enriched_at');
            $table->text('enrichment_error')->nullable()->after('enrichment_successful');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotel_bookings', function (Blueprint $table) {
            $table->dropColumn([
                'canonical_hotel_id',
                'canonical_hotel_name',
                'star_rating',
                'address',
                'latitude',
                'longitude',
                'base_rate',
                'taxes_fees',
                'cancellation_policy',
                'breakfast_included',
                'amenities',
                'facilities',
                'room_type',
                'room_code',
                'room_description',
                'booking_link',
                'hotel_website',
                'screenshots',
                'enriched_at',
                'enrichment_successful',
                'enrichment_error'
            ]);
        });
    }
};
