import { useAdmin } from '../context/AdminContext';
import StatCard from '../components/cards/StatCard';
import RevenueChart from '../components/charts/RevenueChart';
import TopShopsChart from '../components/charts/TopShopsChart';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const Earnings = () => {
    const { earnings } = useAdmin();
    const stats = earnings.stats;

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} change="+12%" changeType="positive" icon={DollarSign} />
                    <StatCard title="This Month" value={`₹${stats.monthly}`} change="+5%" changeType="positive" icon={Calendar} />
                    <StatCard title="Today" value={`₹${stats.today}`} change="-2%" changeType="negative" icon={TrendingUp} />
                    <StatCard title="Platform Fees" value={`₹${(stats.totalRevenue * 0.1).toFixed(2)}`} change="+12%" changeType="positive" icon={CreditCard} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RevenueChart />
                    </div>
                    <div>
                        <TopShopsChart />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Earnings;
