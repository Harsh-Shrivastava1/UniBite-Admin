import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrdersChart = ({ data }) => {
    return (
        <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Orders Overview</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#52525b" axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: '#1f1f1f' }}
                            contentStyle={{ backgroundColor: '#111111', borderColor: '#333333', borderRadius: '0.75rem', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="orders" fill="#ffffff" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrdersChart;
