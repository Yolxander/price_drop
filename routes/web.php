<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelBookingController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\SettingsController;

Route::get('/', function () {
    return view('welcome');
});

// Hotel Price Tracker Routes (without auth for demo)
// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Bookings
Route::get('/bookings', [HotelBookingController::class, 'index'])->name('bookings.index');
Route::get('/bookings/create', [HotelBookingController::class, 'create'])->name('bookings.create');
Route::post('/bookings', [HotelBookingController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{booking}', [HotelBookingController::class, 'show'])->name('bookings.show');
Route::get('/bookings/{booking}/edit', [HotelBookingController::class, 'edit'])->name('bookings.edit');
Route::put('/bookings/{booking}', [HotelBookingController::class, 'update'])->name('bookings.update');
Route::delete('/bookings/{booking}', [HotelBookingController::class, 'destroy'])->name('bookings.destroy');

// Additional booking routes
Route::post('/bookings/check-all-prices', [HotelBookingController::class, 'checkAllPrices'])->name('bookings.check-all-prices');
Route::post('/bookings/{booking}/check-price', [HotelBookingController::class, 'checkPrice'])->name('bookings.check-price');
Route::patch('/bookings/{booking}/toggle-status', [HotelBookingController::class, 'toggleStatus'])->name('bookings.toggle-status');
Route::get('/bookings/{booking}/price-history', [HotelBookingController::class, 'priceHistory'])->name('bookings.price-history');

// Price Alerts
Route::get('/price-alerts', [AlertController::class, 'index'])->name('alerts.index');

// Price History
Route::get('/price-history', [HistoryController::class, 'index'])->name('history.index');

// Reports
Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

// API Status
Route::get('/api-status', [StatusController::class, 'index'])->name('status.index');

// Settings
Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
