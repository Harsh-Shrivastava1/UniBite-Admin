import { useAdmin } from '../../context/AdminContext';
import { User, ShoppingBag, Store, AlertCircle, Info, CheckCircle, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useMemo } from 'react';

const ActivityFeed = () => {
    const { systemLogs } = useAdmin();

    const activities = useMemo(() => {
        return systemLogs.slice(0, 5).map(log => {
            let icon = Info;
            let type = 'info';

            // Simple heuristic for icons
            if (log.action.includes('Order')) icon = ShoppingBag;
            else if (log.action.includes('User')) icon = User;
            else if (log.action.includes('Shop')) icon = Store;
            else if (log.status === 'Warning') icon = AlertCircle;
            else if (log.action.includes('Delete')) icon = Trash2;
            else if (log.status === 'Success') icon = CheckCircle;

            return {
                id: log.id,
                message: log.action,
                time: new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon,
                status: log.status
            };
        });
    }, [systemLogs]);

    return (
        <div className="bg-card rounded-xl border border-border p-6 h-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Live Activity</h3>
            <div className="space-y-6">
                {activities.map((item, index) => (
                    <div key={item.id} className="flex gap-4 relative animate-in fade-in slide-in-from-left-2 duration-300">
                        {/* Connecting Line */}
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border"></div>
                        )}

                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center border shrink-0 bg-secondary border-border"
                        )}>
                            <item.icon className="w-4 h-4 text-foreground" />
                        </div>

                        <div>
                            <p className="text-sm text-foreground font-medium">{item.message}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                    </div>
                ))}
                {activities.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
