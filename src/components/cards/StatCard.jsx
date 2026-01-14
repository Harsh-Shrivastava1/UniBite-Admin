import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
    const isPositive = changeType === 'positive';

    return (
        <div className="bg-card rounded-xl p-6 border border-border hover:border-foreground/20 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-muted-foreground text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
                </div>
                <div className="p-2 rounded-lg bg-secondary text-foreground border border-border group-hover:border-foreground/20 transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="flex items-center mt-4">
                <span className={`flex items-center text-sm font-medium text-foreground`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {change}
                </span>
                <span className="text-muted-foreground text-sm ml-2">vs last week</span>
            </div>
        </div>
    );
};

export default StatCard;
