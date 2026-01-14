import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import StatCard from '../components/cards/StatCard';
import RevenueChart from '../components/charts/RevenueChart';
import OrdersChart from '../components/charts/OrdersChart';
import OrdersTable from '../components/tables/OrdersTable';
import { Users, Store, ShoppingBag, Truck, DollarSign, Activity } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ActivityFeed from '../components/ui/ActivityFeed';
import { useMemo } from 'react';

const Dashboard = () => {
    const { users, shops, deliveryPartners, orders, stats } = useAdmin();

    // Compute Chart Data (last 7 days)
    // In a real app, this would be computed by backend or complex reducer.
    // For now, we simulate a 7-day trend based on current orders + randomness for realism
    const chartData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();

        // Create 7 day buckets
        return Array.from({ length: 7 }).map((_, i) => {
            const dayIndex = (today - 6 + i + 7) % 7;
            // Fake data generation based on total orders to keep it proportional and stable
            // We use dayIndex as a seed for stability, and add orders.length to make it reactive to changes
            const baseRevenue = 2000 + (dayIndex * 500);
            const reactiveRevenue = baseRevenue + (orders.length * 100); // 1 order adds 100 revenue to visual trend

            const baseOrders = 10 + dayIndex;
            const reactiveOrders = baseOrders + Math.floor(orders.length / 2);

            return {
                name: days[dayIndex],
                revenue: reactiveRevenue,
                orders: reactiveOrders
            };
        });
    }, [orders.length]); // Re-compute if order count changes

    // KPI Values
    const kpi = [
        { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, change: "+12.5%", type: "positive", icon: DollarSign },
        { title: "Total Orders", value: stats.totalOrders, change: "+4.3%", type: "positive", icon: ShoppingBag },
        { title: "Active Shops", value: stats.activeShops, change: "0%", type: "neutral", icon: Store },
        { title: "Active Orders", value: stats.activeOrders, change: stats.activeOrders > 10 ? "+2" : "-1", type: stats.activeOrders > 10 ? "positive" : "negative", icon: Activity },
    ];

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
                    <div className="flex space-x-3">
                        <select className="bg-secondary border-transparent text-sm rounded-lg px-3 py-2 focus:ring-primary focus:border-primary text-foreground outline-none">
                            <option>Today</option>
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                        </select>
                        <button className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Download Report
                        </button>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpi.map((stat, idx) => (
                        <StatCard
                            key={idx}
                            title={stat.title}
                            value={stat.value}
                            change={stat.change}
                            changeType={stat.type}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RevenueChart data={chartData} />
                    </div>
                    <div className="h-full">
                        <ActivityFeed />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                        <OrdersChart data={chartData} />
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-foreground">Recent Orders</h3>
                        <Link to="/orders" className="text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors">View All</Link>
                    </div>
                    <OrdersTable limit={5} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default Dashboard;
