# Hotel Price Alert System

A comprehensive Laravel-based system for monitoring hotel booking prices and alerting users to price drops.

## 🏗️ System Architecture

### Core Components

1. **PriceAlertService** - Main service for price checking and alert management
2. **CheckHotelPrices Job** - Background job for processing price checks
3. **PriceDropDetected Notification** - Multi-channel notifications (email, push, SMS)
4. **PriceAlertDigest Notification** - Daily summary notifications
5. **Console Commands** - CLI tools for manual and scheduled operations
6. **Scheduled Tasks** - Automated price checking and cleanup

### Database Tables

- **`hotel_bookings`** - Hotel reservations with price tracking
- **`price_alerts`** - Price drop notifications and history
- **`alert_settings`** - User preferences for notifications and thresholds

## 🚀 Getting Started

### 1. Run Migrations

```bash
php artisan migrate
```

### 2. Set Up Scheduling

The system includes automated scheduling for price checks:

```bash
# Check prices every 2 hours during business hours
# More frequent checks on weekends
# Daily cleanup at 2 AM
# Daily digest at 9 AM
```

### 3. Test the System

```bash
# Check all active bookings
php artisan hotels:check-prices

# Check specific booking
php artisan hotels:check-prices --booking-id=1

# Dispatch as background job
php artisan hotels:check-prices --dispatch-job

# Cleanup only
php artisan hotels:check-prices --cleanup-only
```

## 🔧 Configuration

### Alert Settings

Users can configure:

- **Minimum price drop amount** (e.g., $10)
- **Minimum price drop percentage** (e.g., 5%)
- **Notification methods** (email, push, SMS)
- **Notification frequency** (immediate, daily, weekly)
- **Quiet hours** (when not to send notifications)
- **Excluded providers** (hotel booking sites to ignore)
- **Location preferences** (specific destinations to monitor)

### Default Settings

```php
[
    'min_price_drop_amount' => 10.00,
    'min_price_drop_percent' => 5.00,
    'email_notifications' => true,
    'push_notifications' => true,
    'sms_notifications' => false,
    'notification_frequency' => 'immediate'
]
```

## 📊 API Endpoints

### Price Alerts

```http
GET    /price-alerts                    # List all alerts
POST   /price-alerts                    # Create manual alert
PATCH  /price-alerts/{id}/action       # Mark alert as actioned
PATCH  /price-alerts/{id}/dismiss      # Dismiss alert
POST   /price-alerts/check-prices      # Trigger price check
POST   /price-alerts/{booking}/check-single    # Check specific booking
GET    /price-alerts/{booking}/history # Get price history
PATCH  /price-alerts/{booking}/toggle-monitoring # Toggle monitoring
```

### Alert Settings

```http
GET    /price-alerts/settings          # Get user settings
POST   /price-alerts/settings          # Update user settings
```

## 🔄 How It Works

### 1. Price Monitoring

- System checks active bookings every 2 hours
- Uses SerpAPI to get current prices
- Compares against stored prices
- Creates alerts when drops meet user criteria

### 2. Alert Creation

- Calculates price drop amount and percentage
- Checks user alert settings and preferences
- Respects quiet hours and provider exclusions
- Creates `PriceAlert` record
- Updates `HotelBooking` with new price info

### 3. Notifications

- **Immediate**: Send notification right away
- **Daily**: Collect alerts and send digest at 9 AM
- **Weekly**: Send weekly summary (configurable)

### 4. Price History

- Tracks all price changes over time
- Shows price trends and patterns
- Helps users make informed decisions

## 🎯 Key Features

### Smart Price Checking

- Only checks bookings that haven't been checked recently
- Respects booking status (active, paused, completed)
- Avoids checking bookings too close to check-in
- Fallback to simulated prices for testing

### Intelligent Alerting

- User-defined thresholds for price drops
- Provider and location filtering
- Quiet hours support
- Multiple notification channels

### Performance Optimization

- Background job processing
- Database indexing for fast queries
- Automatic cleanup of old alerts
- Rate limiting for API calls

## 🧪 Testing

### Manual Testing

```bash
# Create test booking
php artisan tinker
$booking = App\Models\HotelBooking::create([...]);

# Check price manually
php artisan hotels:check-prices --booking-id=1

# View alerts
php artisan tinker
App\Models\PriceAlert::all();
```

### Automated Testing

```bash
# Run tests
php artisan test

# Run specific test file
php artisan test tests/Feature/PriceAlertTest.php
```

## 📈 Monitoring & Logging

### Log Files

- **Price checks**: `storage/logs/laravel.log`
- **Job failures**: `storage/logs/laravel.log`
- **API errors**: `storage/logs/laravel.log`

### Key Metrics

- Number of alerts created
- Price check success rate
- Notification delivery rate
- System performance metrics

## 🔒 Security Considerations

- User authentication required for all operations
- Rate limiting on price check endpoints
- Input validation and sanitization
- Secure API key storage for external services

## 🚀 Deployment

### Production Setup

1. **Queue Worker**: Start background job processing
   ```bash
   php artisan queue:work --daemon
   ```

2. **Scheduler**: Set up cron job for Laravel scheduler
   ```bash
   * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
   ```

3. **Environment Variables**:
   ```env
   QUEUE_CONNECTION=database
   MAIL_MAILER=smtp
   SERPAPI_KEY=your_api_key
   ```

### Scaling Considerations

- Use Redis for queue management
- Implement horizontal scaling for job workers
- Consider using external monitoring services
- Set up alerting for system failures

## 🐛 Troubleshooting

### Common Issues

1. **No alerts being created**
   - Check user alert settings
   - Verify booking status is 'active'
   - Check API connectivity

2. **Notifications not sending**
   - Verify mail configuration
   - Check queue worker status
   - Review notification channels

3. **Performance issues**
   - Check database indexes
   - Monitor queue backlog
   - Review API rate limits

### Debug Commands

```bash
# Check queue status
php artisan queue:work --once

# View scheduled tasks
php artisan schedule:list

# Test notification
php artisan tinker
$user->notify(new App\Notifications\PriceDropDetected($alert));
```

## 📚 Additional Resources

- [Laravel Notifications](https://laravel.com/docs/notifications)
- [Laravel Queues](https://laravel.com/docs/queues)
- [Laravel Scheduling](https://laravel.com/docs/scheduling)
- [SerpAPI Documentation](https://serpapi.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
