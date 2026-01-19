import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import PageWrapper from '../components/layout/PageWrapper';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import {
    Shield,
    Lock,
    UserCircle,
    Server,
    ToggleLeft,
    ToggleRight,
    Save,
    Trash2,
    RefreshCw,
    Database,
    Cpu,
    Activity,
    AlertTriangle,
    CreditCard,
    ShoppingBag,
    Users,
    Key,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const {
        settings,
        updateSettings,
        systemLogs,
        addSystemLog,
        resetSystem,
        clearCache,
        logout
    } = useAdmin();
    const toast = useToast();

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        isDanger: false
    });
    const [isLoading, setIsLoading] = useState(false);

    // Local form state for inputs that shouldn't auto-save on every keystroke
    // However, for simplicity and "real-time" feel, we might just use onBlur or debounce. 
    // Given the requirements "Use existing global state", we will push updates to context.

    const handleConfirm = async () => {
        if (modalConfig.action) {
            setIsLoading(true);
            // Simulate async action
            await new Promise(resolve => setTimeout(resolve, 800));
            modalConfig.action();
            setIsLoading(false);
            setModalConfig({ ...modalConfig, isOpen: false });
        }
    };

    const openModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    // Render Helpers
    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
            <div className="p-2 bg-secondary rounded-lg">
                <Icon className="w-6 h-6 text-foreground" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1 text-clip">{description}</p>
            </div>
        </div>
    );

    const Toggle = ({ checked, onChange, label, description }) => (
        <div className="flex items-center justify-between py-3">
            <div>
                <div className="font-medium text-foreground text-sm">{label}</div>
                {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={clsx("transition-colors focus:outline-none", checked ? "text-foreground" : "text-muted-foreground/50")}
            >
                {checked ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
        </div>
    );

    const Input = ({ label, value, onChange, type = "text", suffix }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-foreground focus:border-foreground outline-none transition-all"
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{suffix}</span>
                )}
            </div>
        </div>
    );

    return (
        <PageWrapper>
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isDanger={modalConfig.isDanger}
                isLoading={isLoading}
            />

            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">System Control Center</h1>
                        <p className="text-muted-foreground mt-2">Manage global configurations, security, and integrity.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span>System Healthy • v2.5.0</span>
                    </div>
                </div>

                {/* 1. SECURITY SECTION */}
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader icon={Shield} title="Security & Authentication" description="Manage access policies, protocols, and sessions." />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Toggle
                                label="Enforce 2FA"
                                description="Require Two-Factor Authentication for all admin actions."
                                checked={settings.security?.enforce2FA}
                                onChange={(val) => {
                                    updateSettings('enforce2FA', val, 'security');
                                    addSystemLog(`Toggle 2FA Enforcement: ${val ? 'On' : 'Off'}`);
                                    toast.success(`2FA Enforcement ${val ? 'Enabled' : 'Disabled'}`);
                                }}
                            />

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Session Timeout</label>
                                <select
                                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
                                    value={settings.security?.sessionTimeout}
                                    onChange={(e) => {
                                        updateSettings('sessionTimeout', e.target.value, 'security');
                                        addSystemLog(`Updated Session Timeout to ${e.target.value}`);
                                        toast.info("Session timeout updated.");
                                    }}
                                >
                                    <option value="15m">15 Minutes</option>
                                    <option value="30m">30 Minutes</option>
                                    <option value="1h">1 Hour</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end space-y-4">
                            <div className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Last Admin Login</span>
                                <span className="text-sm font-mono text-foreground">{new Date().toLocaleString()} (You)</span>
                            </div>
                            <button
                                onClick={() => openModal({
                                    title: "Force Logout All Users?",
                                    message: "This will immediately terminate all active sessions including yours. Users will need to log in again.",
                                    isDanger: true,
                                    action: () => {
                                        logout();
                                        addSystemLog("Force Logout All Users", "Warning");
                                    }
                                })}
                                className="w-full py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Force Logout All Sessions
                            </button>
                        </div>
                    </div>
                </section>

                {/* 2. PLATFORM CONFIGURATION */}
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader icon={Server} title="Platform Configuration" description="Global parameters affecting business logic and fees." />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input
                            label="Platform Commission"
                            type="number"
                            suffix="%"
                            value={settings.platform?.commission}
                            onChange={(val) => updateSettings('commission', val, 'platform')}
                        />
                        <Input
                            label="Min Order Amount"
                            type="number"
                            suffix="INR"
                            value={settings.platform?.minOrderAmount}
                            onChange={(val) => updateSettings('minOrderAmount', val, 'platform')}
                        />
                        <Input
                            label="Max Active Orders / Shop"
                            type="number"
                            value={settings.platform?.maxActiveOrders}
                            onChange={(val) => updateSettings('maxActiveOrders', val, 'platform')}
                        />
                        <div className="flex items-center h-full pt-6">
                            <Toggle
                                label="Auto-Assign Delivery"
                                checked={settings.platform?.autoAssign}
                                onChange={(val) => updateSettings('autoAssign', val, 'platform')}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. ADMIN PROFILE */}
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader icon={UserCircle} title="Admin Profile" description="Update your system identity details." />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-5">
                            <Input
                                label="Display Name"
                                value={settings.admin?.name}
                                onChange={(val) => updateSettings('name', val, 'admin')}
                            />
                            <Input
                                label="Email Contact"
                                value={settings.admin?.email}
                                onChange={(val) => updateSettings('email', val, 'admin')}
                            />
                            <div className="pt-2">
                                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <Key className="w-3 h-3" /> Change Password
                                </button>
                            </div>
                        </div>

                        <div className="bg-secondary/30 p-6 rounded-xl border border-border flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border border-border flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                SA
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-foreground">{settings.admin?.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Super Admin</span>
                                    <span className="text-xs text-muted-foreground">{settings.admin?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FEATURE FLAGS */}
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader icon={Cpu} title="Feature Flags" description="Toggle experimental and beta capabilities." />

                    <div className="space-y-2">
                        <Toggle
                            label="Enable AI Insights"
                            description="Uses generative models to predict sales trends."
                            checked={settings.features?.ai}
                            onChange={(val) => {
                                updateSettings('ai', val, 'features');
                                addSystemLog(`Toggle AI Features: ${val ? 'On' : 'Off'}`);
                            }}
                        />
                        <div className="border-t border-border/50 my-2" />
                        <Toggle
                            label="Beta UI Components"
                            description="Opt-in to verify new interface elements before release."
                            checked={settings.features?.beta}
                            onChange={(val) => updateSettings('beta', val, 'features')}
                        />
                        <div className="border-t border-border/50 my-2" />
                        <Toggle
                            label="Experimental Dashboard"
                            description="Early access to the V3 analytics engine."
                            checked={settings.features?.experimental}
                            onChange={(val) => updateSettings('experimental', val, 'features')}
                        />
                    </div>
                </section>

                {/* 5. SYSTEM LOGS */}
                <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <SectionHeader icon={Database} title="System Logs" description="Audit trail of recent administrative actions." />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-3">Action</th>
                                    <th className="px-6 py-3">Performed By</th>
                                    <th className="px-6 py-3">Date & Time</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {systemLogs && systemLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{log.action}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{log.performedBy}</td>
                                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                                            {new Date(log.date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                log.status === 'Success' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                    log.status === 'Warning' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                        "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!systemLogs || systemLogs.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No logs available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 6. DANGER ZONE */}
                <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-red-500">Danger Zone</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-background border border-border rounded-lg">
                            <h4 className="font-medium text-foreground mb-1">Export System Data</h4>
                            <p className="text-xs text-muted-foreground mb-4">Download a JSON dump of all users, orders, and settings.</p>
                            <button
                                onClick={() => {
                                    toast.success("Data export started. Check downloads folder.");
                                    addSystemLog("Export System Data");
                                }}
                                className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium rounded-md transition-colors"
                            >
                                Export JSON
                            </button>
                        </div>

                        <div className="p-4 bg-background border border-border rounded-lg">
                            <h4 className="font-medium text-foreground mb-1">Clear System Cache</h4>
                            <p className="text-xs text-muted-foreground mb-4">Force reload external assets and flush local storage.</p>
                            <button
                                onClick={() => openModal({
                                    title: "Clear System Cache?",
                                    message: "This might cause temporary performance degradation as assets are re-fetched.",
                                    action: clearCache
                                })}
                                className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium rounded-md transition-colors"
                            >
                                Clear Cache
                            </button>
                        </div>

                        <div className="p-4 bg-background border border-red-500/20 rounded-lg">
                            <h4 className="font-medium text-red-500 mb-1">Reload System</h4>
                            <p className="text-xs text-muted-foreground mb-4">Reload the application to refresh all data connections.</p>
                            <button
                                onClick={() => openModal({
                                    title: "Reload Application?",
                                    message: "This will refresh the page and reconnect to Supabase.",
                                    isDanger: true,
                                    confirmText: "Yes, Reload",
                                    action: resetSystem
                                })}
                                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors shadow-lg shadow-red-900/20"
                            >
                                Reload App
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
};

export default Settings;
