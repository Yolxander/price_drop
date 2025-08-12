<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'avatar' => null,
                ],
            ],
        ]);
    }
}
