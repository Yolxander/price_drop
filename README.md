# Hotel Price Tracker

A Laravel-based hotel price tracking application that monitors hotel prices using SerpAPI's Google Hotels API. The application allows users to track their hotel bookings and get notified when prices drop.

## Features

### 🏨 Hotel Booking Management
- Add hotel bookings with details (hotel name, location, dates, guests, price)
- Track multiple bookings simultaneously
- View booking status (active, paused, completed)
- Edit and delete bookings

### 💰 Price Monitoring
- Automatic price checking using SerpAPI's Google Hotels API
- Real-time price comparison with original booking price
- Price drop detection and notifications
- Price history tracking

### 📊 Dashboard Analytics
- Overview of all tracked bookings
- Total savings detected
- Recent price check activity
- API status monitoring

### 🔔 Notifications
- Price drop alerts
- Daily check completion notifications
- Email notifications (ready for implementation)

## Technology Stack

- **Backend**: Laravel 11 with PHP 8.2+
- **Frontend**: React with Inertia.js
- **UI Components**: Shadcn/ui
- **Database**: SQLite (configurable for production)
- **API Integration**: SerpAPI Google Hotels API
- **Job Queue**: Laravel Queue for background processing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd google-scraper
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   ```bash
   # For SQLite (default)
   touch database/database.sqlite
   
   # Or configure MySQL/PostgreSQL in .env
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```

## Configuration

### SerpAPI Setup

1. Sign up for a SerpAPI account at [serpapi.com](https://serpapi.com)
2. Get your API key from the dashboard
3. Add the API key to your `.env` file:
   ```
   SERPAPI_KEY=your_api_key_here
   ```

### Environment Variables

```env
# Database
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

# SerpAPI
SERPAPI_KEY=your_api_key_here

# Queue (for background jobs)
QUEUE_CONNECTION=database
```

## Usage

### Adding a Hotel Booking

1. Navigate to the dashboard
2. Click "Add Booking" button
3. Fill in the booking details:
   - Hotel name
   - Location
   - Check-in and check-out dates
   - Number of guests
   - Currency
   - Original price
   - Booking reference (optional)

### Monitoring Prices

- The system automatically checks prices for active bookings
- Manual price checks can be triggered from the dashboard
- Price drops are highlighted with savings amounts
- All price changes are logged in the recent activity section

### Managing Bookings

- **Active**: Booking is being monitored for price changes
- **Paused**: Price monitoring is temporarily stopped
- **Completed**: Booking is no longer being tracked

## API Integration

### SerpAPI Google Hotels API

The application integrates with SerpAPI's Google Hotels API to fetch current hotel prices:

```php
// Example API call
$response = Http::get('https://serpapi.com/search.json', [
    'engine' => 'google_hotels',
    'q' => 'Fairmont Royal York',
    'check_in_date' => '2025-09-01',
    'check_out_date' => '2025-09-05',
    'currency' => 'CAD',
    'adults' => 2,
    'hl' => 'en',
    'api_key' => env('SERPAPI_KEY')
]);
```

### Response Format

```json
{
  "search_metadata": { "id": "...", "status": "Success" },
  "properties": [
    {
      "name": "Fairmont Royal York",
      "price": "$329",
      "total_price": "$1,316",
      "rating": 4.5,
      "reviews": 8392,
      "link": "https://www.google.com/travel/hotels/entity/..."
    }
  ]
}
```

## Background Jobs

The application uses Laravel jobs for background price checking:

```bash
# Process background jobs
php artisan queue:work

# Or use supervisor for production
```

### Job Scheduling

Add to `app/Console/Kernel.php` for automated daily checks:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->job(new CheckHotelPrices)->daily();
}
```

## File Structure

```
app/
├── Http/Controllers/
│   ├── DashboardController.php      # Dashboard data
│   └── HotelBookingController.php   # Booking CRUD operations
├── Jobs/
│   └── CheckHotelPrices.php         # Background price checking
├── Models/
│   └── HotelBooking.php             # Booking model
└── Services/
    └── SerpApiService.php           # SerpAPI integration

resources/js/Pages/
└── Dashboard.jsx                    # Main dashboard component

database/migrations/
└── create_hotel_bookings_table.php  # Database schema
```

## Database Schema

### hotel_bookings table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| hotel_name | string | Hotel name |
| location | string | Hotel location |
| check_in_date | date | Check-in date |
| check_out_date | date | Check-out date |
| guests | integer | Number of guests |
| currency | string(3) | Currency code |
| original_price | decimal(10,2) | Original booking price |
| current_price | decimal(10,2) | Current market price |
| last_checked | timestamp | Last price check time |
| status | enum | active/paused/completed |
| price_drop_detected | boolean | Price drop flag |
| price_drop_amount | decimal(10,2) | Amount saved |
| booking_reference | string | External booking reference |
| user_id | bigint | User who owns the booking |

## Development

### Adding New Features

1. **New API Integration**: Extend `SerpApiService.php`
2. **New UI Components**: Add to `resources/js/components/`
3. **New Routes**: Add to `routes/web.php`
4. **Database Changes**: Create new migrations

### Testing

```bash
# Run tests
php artisan test

# Run specific test
php artisan test --filter=HotelBookingTest
```

### Code Style

```bash
# Format PHP code
./vendor/bin/pint

# Format JavaScript code
npm run format
```

## Production Deployment

### Requirements

- PHP 8.2+
- Node.js 18+
- Database (MySQL/PostgreSQL recommended)
- Redis (for queue processing)
- Supervisor (for background jobs)

### Deployment Steps

1. **Server Setup**
   ```bash
   # Install dependencies
   composer install --optimize-autoloader --no-dev
   npm ci && npm run build
   
   # Set permissions
   chmod -R 775 storage bootstrap/cache
   ```

2. **Environment Configuration**
   ```bash
   # Set production environment
   APP_ENV=production
   APP_DEBUG=false
   
   # Configure database
   DB_CONNECTION=mysql
   DB_HOST=your_db_host
   DB_DATABASE=your_db_name
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   ```

3. **Queue Processing**
   ```bash
   # Start queue worker
   php artisan queue:work --daemon
   
   # Or use supervisor
   sudo supervisorctl reread
   sudo supervisorctl update
   ```

## Limitations

### Current Implementation (Demo)

- Uses dummy data for price checking
- No real SerpAPI integration (commented out)
- Basic notification system (logs only)

### Production Considerations

- Implement real SerpAPI integration
- Add email/SMS notifications
- Implement rate limiting
- Add user authentication
- Add data validation and sanitization
- Implement caching for API responses
- Add error handling and retry logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Note**: This is a demo implementation with dummy data. For production use, implement real SerpAPI integration and proper error handling.
