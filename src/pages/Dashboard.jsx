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

    const chartData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = [];

        // Generate last 7 days dates (inclusive of today)
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(d);
        }

        return last7Days.map(date => {
            // Compare by date string YYYY-MM-DD to avoid time issues
            const dateStr = date.toISOString().split('T')[0];
            const dayName = days[date.getDay()];

            // Filter orders for this specific date
            const dayOrders = orders.filter(o => {
                if (!o.created_at) return false;
                // robust date parsing
                const orderDate = new Date(o.created_at);
                return orderDate.toISOString().split('T')[0] === dateStr;
            });

            // Revenue: Sum of amount for 'delivered' orders only
            const dayRevenue = dayOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + Number(o.amount || 0), 0);

            return {
                name: dayName,
                revenue: dayRevenue,
                orders: dayOrders.length
            };
        });
    }, [orders]);

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
