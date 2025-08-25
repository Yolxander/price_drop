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
            $table->boolean('price_alert_active')->default(false)->after('price_drop_amount');
            $table->index(['user_id', 'price_alert_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotel_bookings', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'price_alert_active']);
            $table->dropColumn('price_alert_active');
        });
    }
};
