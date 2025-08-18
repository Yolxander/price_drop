<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelBookingController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SerpApiController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

// Hotel Price Tracker Routes (with auth)
Route::middleware(['auth', 'verified'])->group(function () {
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
    Route::post('/bookings/{booking}/enrich', [HotelBookingController::class, 'enrichBooking'])->name('bookings.enrich');

    // Price Alerts
    Route::get('/price-alerts', [AlertController::class, 'index'])->name('alerts.index');
    Route::post('/price-alerts', [AlertController::class, 'createPriceAlert'])->name('alerts.create');
    Route::patch('/price-alerts/{id}/action', [AlertController::class, 'markAsActioned'])->name('alerts.action');
    Route::patch('/price-alerts/{id}/dismiss', [AlertController::class, 'dismiss'])->name('alerts.dismiss');
    Route::post('/price-alerts/mark-all-read', [AlertController::class, 'markAllAsRead'])->name('alerts.mark-all-read');
    Route::get('/price-alerts/settings', [AlertController::class, 'getAlertSettings'])->name('alerts.settings');
    Route::post('/price-alerts/settings', [AlertController::class, 'updateAlertSettings'])->name('alerts.update-settings');
    Route::post('/price-alerts/check-prices', [AlertController::class, 'checkPrices'])->name('alerts.check-prices');

    Route::post('/price-alerts/mark-all-read', [AlertController::class, 'markAllAsRead'])->name('alerts.mark-all-read');
    Route::get('/price-alerts/settings', [AlertController::class, 'getSettings'])->name('alerts.settings');
    Route::post('/price-alerts/settings', [AlertController::class, 'updateSettings'])->name('alerts.update-settings');
    Route::post('/price-alerts/create', [AlertController::class, 'createAlert'])->name('alerts.create');

    // Price History
    Route::get('/price-history', [HistoryController::class, 'index'])->name('history.index');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // API Status
    Route::get('/api-status', [StatusController::class, 'index'])->name('status.index');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');

    // Favorites
    Route::get('/favorites', [HotelBookingController::class, 'favorites'])->name('favorites.index');

    // Calendar
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');

    // SerpAPI Routes
    Route::prefix('api/serp')->group(function () {
        Route::get('/test-connection', [SerpApiController::class, 'testConnection'])->name('serp.test-connection');
        Route::get('/usage', [SerpApiController::class, 'getApiUsage'])->name('serp.usage');
        Route::get('/exchange-rates', [SerpApiController::class, 'getExchangeRates'])->name('serp.exchange-rates');
        Route::post('/search-flights', [SerpApiController::class, 'searchFlights'])->name('serp.search-flights');
        Route::post('/web-search', [SerpApiController::class, 'webSearch'])->name('serp.web-search');
        Route::post('/convert-currency', [SerpApiController::class, 'convertCurrency'])->name('serp.convert-currency');
    });

    // SerpAPI Demo Page
    Route::get('/serp-demo', function () {
        return Inertia::render('SerpApiDemo');
    })->name('serp.demo');
});

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
