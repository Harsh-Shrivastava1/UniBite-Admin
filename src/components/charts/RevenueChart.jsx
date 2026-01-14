import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
    return (
        <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Revenue Trend</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#52525b" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111111', borderColor: '#333333', borderRadius: '0.75rem', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
