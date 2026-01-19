import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import StatCard from '../components/cards/StatCard';
import RevenueChart from '../components/charts/RevenueChart';
import TopShopsChart from '../components/charts/TopShopsChart';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const Earnings = () => {
    // Local state for real data
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        monthly: 0,
        today: 0,
        platformFees: 0
    });
    const [revenueChartData, setRevenueChartData] = useState([]);
    const [topShopsData, setTopShopsData] = useState([]);

    useEffect(() => {
        fetchEarningsData();
    }, []);

    const fetchEarningsData = async () => {
        setLoading(true);
        try {
            // Fetch all non-cancelled orders with necessary fields
            const { data: orders, error } = await supabase
                .from('orders')
                .select(`
                    total_amount,
                    created_at,
                    shop_id,
                    status,
                    shops (name)
                `)
                .neq('status', 'cancelled')
                .order('created_at', { ascending: true }); // Order by date for easier chart building

            if (error) throw error;

            processData(orders || []);
        } catch (error) {
            console.error("Error fetching earnings:", error);
        } finally {
            setLoading(false);
        }
    };

    const processData = (orders) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        // Start of today (00:00:00)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

        let total = 0;
        let month = 0;
        let today = 0;

        const dateMap = {}; // For Revenue Chart (YYYY-MM-DD -> amount)
        const shopMap = {}; // For Top Shops (shopName -> amount)

        orders.forEach(order => {
            const amount = Number(order.total_amount) || 0;

            // 1. Aggregates
            total += amount;

            if (order.created_at >= startOfMonth) {
                month += amount;
            }

            if (order.created_at >= startOfToday) {
                today += amount;
            }

            // 2. Chart Data (Group by Date)
            // Extract YYYY-MM-DD only
            const dateKey = order.created_at.split('T')[0];
            if (!dateMap[dateKey]) {
                dateMap[dateKey] = 0;
            }
            dateMap[dateKey] += amount;

            // 3. Top Shops
            // Handle joined shop name safely
            const shopName = order.shops?.name || 'Unknown Shop';
            if (!shopMap[shopName]) {
                shopMap[shopName] = 0;
            }
            shopMap[shopName] += amount;
        });

        // Format Chart Data
        // Sort keys to ensure chronological order (already sorted by fetch, but good to be safe)
        const chartData = Object.keys(dateMap).sort().map(dateStr => {
            const dateObj = new Date(dateStr);
            return {
                name: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g., "Jan 19"
                revenue: dateMap[dateStr]
            };
        });

        // Format Top Shops Data
        const topShops = Object.entries(shopMap)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue) // Descending
            .slice(0, 5); // Top 5

        setStats({
            totalRevenue: total.toFixed(2),
            monthly: month.toFixed(2),
            today: today.toFixed(2),
            platformFees: (total * 0.10).toFixed(2) // Assumed 10% platform fee
        });

        setRevenueChartData(chartData);
        setTopShopsData(topShops);
    };

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">Financial Overview</h2>
                    <div className="flex space-x-3">
                        <select className="bg-secondary border-transparent text-sm rounded-lg px-3 py-2 text-foreground outline-none border border-border">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats.totalRevenue}`}
                        change={loading ? "..." : "+12%"} // Static percent for now as history not calculated
                        changeType="positive"
                        icon={DollarSign}
                    />
                    <StatCard
                        title="This Month"
                        value={`₹${stats.monthly}`}
                        change={loading ? "..." : "+5%"}
                        changeType="positive"
                        icon={Calendar}
                    />
                    <StatCard
                        title="Today"
                        value={`₹${stats.today}`}
                        change={loading ? "..." : "-2%"}
                        changeType="negative"
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Platform Fees"
                        value={`₹${stats.platformFees}`}
                        change="+12%"
                        changeType="positive"
                        icon={CreditCard}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {/* Pass real data to chart */}
                        <RevenueChart data={revenueChartData} />
                    </div>
                    <div>
                        {/* Pass real data to TopShopsChart */}
                        <TopShopsChart data={topShopsData} />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Earnings;
