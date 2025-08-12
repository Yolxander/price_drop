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
        Schema::create('hotel_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('hotel_name');
            $table->string('location');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('guests');
            $table->string('currency', 3);
            $table->decimal('original_price', 10, 2);
            $table->decimal('current_price', 10, 2)->nullable();
            $table->timestamp('last_checked')->nullable();
            $table->enum('status', ['active', 'paused', 'completed'])->default('active');
            $table->boolean('price_drop_detected')->default(false);
            $table->decimal('price_drop_amount', 10, 2)->nullable();
            $table->string('booking_reference')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_bookings');
    }
};
