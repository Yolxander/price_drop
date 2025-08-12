import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Users,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Download,
    MoreHorizontal
} from 'lucide-react';

export default function Dashboard({ auth }) {
    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            description: '+20.1% from last month',
            icon: DollarSign,
            trend: 'up',
            color: 'text-chart-1'
        },
        {
            title: 'Subscriptions',
            value: '+2350',
            description: '+180.1% from last month',
            icon: Users,
            trend: 'up',
            color: 'text-chart-2'
        },
        {
            title: 'Sales',
            value: '+12,234',
            description: '+19% from last month',
            icon: ShoppingCart,
            trend: 'up',
            color: 'text-chart-3'
        },
        {
            title: 'Active Now',
            value: '+573',
            description: '+201 since last hour',
            icon: Activity,
            trend: 'down',
            color: 'text-chart-4'
        }
    ];

    const recentActivity = [
        {
            id: 1,
            user: 'John Doe',
            action: 'purchased a subscription',
            time: '2 minutes ago',
            amount: '$299.00'
        },
        {
            id: 2,
            user: 'Jane Smith',
            action: 'cancelled their subscription',
            time: '5 minutes ago',
            amount: '-$99.00'
        },
        {
            id: 3,
            user: 'Mike Johnson',
            action: 'upgraded to premium',
            time: '10 minutes ago',
            amount: '+$200.00'
        },
        {
            id: 4,
            user: 'Sarah Wilson',
            action: 'made a purchase',
            time: '15 minutes ago',
            amount: '$149.00'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Dashboard"
        >
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1 text-chart-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1 text-destructive" />
                                    )}
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts and Activity */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Chart Card */}
                    <Card className="col-span-4 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>
                                    Monthly revenue and subscription growth
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border border-border/50">
                                <div className="text-center">
                                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Chart component would go here</p>
                                    <p className="text-sm text-muted-foreground/70">Using a library like Recharts or Chart.js</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="col-span-3 border-border/50">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest transactions and user actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none text-foreground">
                                                {activity.user}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.action}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-foreground">{activity.amount}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                <Eye className="h-4 w-4 mr-2" />
                                View all activity
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Create Order
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Activity className="mr-2 h-4 w-4" />
                                View Reports
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">API Status</span>
                                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Database</span>
                                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Cache</span>
                                    <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Queue</span>
                                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Premium Plan</span>
                                    <span className="text-sm font-medium text-foreground">$299</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Basic Plan</span>
                                    <span className="text-sm font-medium text-foreground">$99</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Enterprise</span>
                                    <span className="text-sm font-medium text-foreground">$999</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-chart-1 rounded-full"></div>
                                    <span className="text-sm text-foreground">John Doe</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-chart-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Jane Smith</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-chart-3 rounded-full"></div>
                                    <span className="text-sm text-foreground">Mike Johnson</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
