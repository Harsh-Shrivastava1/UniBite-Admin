import PageWrapper from '../components/layout/PageWrapper';
import { useAdmin } from '../context/AdminContext';
import { Laptop, Phone, Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const LoginActivity = () => {
    const { loginActivity } = useAdmin();

    return (
        <PageWrapper>
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Login Activity</h2>
                        <p className="text-muted-foreground mt-1">Monitor recent access to your account.</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-secondary/50">
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Device</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Location</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Date & Time</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loginActivity.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-secondary/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-secondary rounded-lg">
                                                    {activity.device.toLowerCase().includes('phone') ? (
                                                        <Phone className="w-4 h-4 text-foreground" />
                                                    ) : (
                                                        <Laptop className="w-4 h-4 text-foreground" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-foreground">{activity.device}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <Globe className="w-3 h-3" />
                                                <span>{activity.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {activity.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={clsx(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                activity.status === 'Success'
                                                    ? "bg-foreground/10 text-foreground border-foreground/20"
                                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                {activity.status === 'Success' ? (
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                                )}
                                                {activity.status}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default LoginActivity;
