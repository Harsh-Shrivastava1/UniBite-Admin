import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAdmin } from '../../context/AdminContext';

const TopShopsChart = () => {
    const { shops } = useAdmin();
    // Sort by revenue slice top 5
    const data = [...shops]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(s => ({ name: s.name, revenue: s.revenue }));

    const COLORS = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];

    return (
        <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Top Shops by Revenue</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data} margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#52525b" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                        <YAxis dataKey="name" type="category" stroke="#fff" axisLine={false} tickLine={false} width={100} />
                        <Tooltip
                            cursor={{ fill: '#1f1f1f' }}
                            contentStyle={{ backgroundColor: '#111111', borderColor: '#333333', borderRadius: '0.5rem', color: '#fff' }}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopShopsChart;
