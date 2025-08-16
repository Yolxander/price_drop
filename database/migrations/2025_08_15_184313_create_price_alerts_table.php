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
        Schema::create('price_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('hotel_name');
            $table->string('location');
            $table->string('provider');
            $table->decimal('booked_price', 10, 2);
            $table->decimal('current_price', 10, 2);
            $table->decimal('delta_amount', 10, 2);
            $table->decimal('delta_percent', 5, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('rule_threshold');
            $table->enum('status', ['new', 'actioned', 'dismissed'])->default('new');
            $table->enum('severity', ['low', 'medium', 'high'])->default('medium');
            $table->timestamp('triggered_at');
            $table->timestamp('actioned_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['hotel_booking_id', 'status']);
            $table->index('triggered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_alerts');
    }
};
