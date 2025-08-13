import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Building2, Calendar, Users, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

export default function Create({ auth }) {
    const [formData, setFormData] = useState({
        hotel_name: '',
        location: '',
        check_in_date: '',
        check_out_date: '',
        guests: 2,
        rooms: 1,
        room_type: '',
        currency: 'USD',
        original_price: '',
        booking_reference: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        // Prevent any default form submission
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();

        setIsSubmitting(true);

        // Ensure we have the correct data structure
        const submitData = {
            hotel_name: formData.hotel_name || '',
            location: formData.location || '',
            check_in_date: formData.check_in_date || '',
            check_out_date: formData.check_out_date || '',
            guests: parseInt(formData.guests) || 1,
            rooms: parseInt(formData.rooms) || 1,
            room_type: formData.room_type || '',
            original_price: parseFloat(formData.original_price) || 0,
            currency: formData.currency || 'USD',
            booking_reference: formData.booking_reference || ''
        };

        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Original form data:', formData);
        console.log('Transformed submit data:', submitData);
        console.log('JSON stringified data:', JSON.stringify(submitData));
        console.log('Form element:', e.target);
        console.log('=== END DEBUG ===');

        try {
            const response = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                // Redirect to bookings page instead of dashboard
                window.location.href = '/bookings';
            } else {
                const data = await response.json();
                console.error('Error creating booking:', data);

                // Show error message to user
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    alert('Error creating booking: ' + errorMessages.join(', '));
                } else {
                    alert('Error creating booking. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Track a New Trip"
        >
            <div className="max-w-2xl mx-auto space-y-6 pt-4 bg-gray-50 min-h-screen">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>

                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-gray-900">
                            <Building2 className="h-5 w-5 text-green-500" />
                            <span>Trip Details</span>
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Tell us about your upcoming stay
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Hotel Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Hotel Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Hotel Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="hotel_name"
                                            value={formData.hotel_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                            placeholder="e.g., Fairmont Royal York"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                            placeholder="e.g., Toronto, ON"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Dates</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Check-in Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="check_in_date"
                                            value={formData.check_in_date}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Check-out Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="check_out_date"
                                            value={formData.check_out_date}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Guests and Price */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Guests and Price</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Number of Guests
                                        </label>
                                        <input
                                            type="number"
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="10"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Number of Rooms
                                        </label>
                                        <input
                                            type="number"
                                            name="rooms"
                                            value={formData.rooms}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="5"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Room Type
                                        </label>
                                        <input
                                            type="text"
                                            name="room_type"
                                            value={formData.room_type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                            placeholder="e.g., Deluxe King Room"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Currency
                                        </label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        >
                                            {currencies.map(currency => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.symbol} {currency.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Total Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="original_price"
                                        value={formData.original_price}
                                        onChange={handleInputChange}
                                        required
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Booking Reference */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Booking Reference (Optional)</h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Booking Reference
                                    </label>
                                    <input
                                        type="text"
                                        name="booking_reference"
                                        value={formData.booking_reference}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                                        placeholder="e.g., ABC123456"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This helps us verify your booking details
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-500 hover:bg-green-600 text-white border-0"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Booking'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
