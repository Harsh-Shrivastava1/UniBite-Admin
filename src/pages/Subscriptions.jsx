import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import {
    Loader2,
    Search,
    CreditCard,
    CheckCircle,
    XCircle,
    Calendar,
    Edit3
} from 'lucide-react';
import clsx from 'clsx';

const Subscriptions = () => {
    // const { isAdminAuthenticated } = useAdmin(); // Removed (extracted above)
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [shops, setShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [editFee, setEditFee] = useState('');

    // Use shops from context as source of truth
    const { shops: contextShops, isAdminAuthenticated } = useAdmin();

    const fetchSubscriptionData = async () => {
        setLoading(true);
        try {
            // 1. Fetch subscription data separately
            const { data: subsData, error } = await supabase
                .from('shop_subscriptions')
                .select('*');

            if (error) {
                // If table doesn't exist or other error, we just log and proceed with defaults
                console.warn('Could not fetch subscriptions (Table might be missing):', error.message);
            }

            // 2. Merge with context shops
            const mergedData = (contextShops || []).map(shop => {
                const sub = (subsData || []).find(s => s.shop_id === shop.id);

                // Deterministic mock data generation based on shop ID
                // ensuring consistent display without database writes
                const mockFee = (shop.name.length * 100) + 1000;
                const isPaidMock = shop.name.length % 2 === 0;

                const now = new Date();
                const lastMonth = new Date(now);
                lastMonth.setMonth(now.getMonth() - 1);

                const nextMonth = new Date(now);
                nextMonth.setMonth(now.getMonth() + 1);

                return {
                    id: shop.id,
                    name: shop.name,
                    monthly_fee: sub ? (sub.monthly_fee || 0) : mockFee,
                    status: sub ? (sub.status || 'unpaid') : (isPaidMock ? 'paid' : 'unpaid'),
                    last_paid_date: sub ? sub.last_paid_date : (isPaidMock ? lastMonth.toISOString() : null),
                    next_billing_date: sub ? sub.next_billing_date : (isPaidMock ? nextMonth.toISOString() : now.toISOString()),
                    subscription_id: sub ? sub.id : null,
                    isMock: !sub // Flag to indicate this is mock data
                };
            });

            setShops(mergedData);
        } catch (error) {
            console.error('Error combining data:', error);
            // Fallback to just showing shops
            setShops(contextShops.map(s => ({
                id: s.id,
                name: s.name,
                monthly_fee: 0,
                status: 'unpaid'
            })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchSubscriptionData();
        }
    }, [isAdminAuthenticated, contextShops]);

    const handleMarkPaid = async (shop) => {
        try {
            const nextBilling = new Date();
            nextBilling.setMonth(nextBilling.getMonth() + 1);

            const payload = {
                status: 'paid',
                last_paid_date: new Date().toISOString(),
                next_billing_date: nextBilling.toISOString()
            };

            const { error } = await updateSubscription(shop.id, payload);

            if (error) throw error;

            toast.success(`Marked ${shop.name} as Paid`);
            fetchSubscriptionData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const handleMarkUnpaid = async (shop) => {
        try {
            const payload = {
                status: 'unpaid'
            };

            const { error } = await updateSubscription(shop.id, payload);

            if (error) throw error;

            toast.success(`Marked ${shop.name} as Unpaid`);
            fetchSubscriptionData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const handleUpdateFee = async () => {
        if (!selectedShop) return;

        try {
            const payload = {
                monthly_fee: Number(editFee)
            };

            const { error } = await updateSubscription(selectedShop.id, payload);

            if (error) throw error;

            toast.success('Monthly fee updated');
            setIsEditModalOpen(false);
            fetchSubscriptionData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update fee');
        }
    };

    // Helper to upsert subscription
    const updateSubscription = async (shopId, updates) => {
        // First check if sub exists, if not we need to insert linked to shop_id
        // We can use upsert on shop_id if unique constraint exists, or check first.
        // Given the requirement "User: Left join shop_subscriptions", we assume 0 or 1.

        // We'll try upserting with shop_id as the key
        const { error } = await supabase
            .from('shop_subscriptions')
            .upsert({
                shop_id: shopId,
                ...updates
            }, { onConflict: 'shop_id' });

        return { error };
    };

    const openEditModal = (shop) => {
        setSelectedShop(shop);
        setEditFee(shop.monthly_fee);
        setIsEditModalOpen(true);
    };

    const filteredShops = shops.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
                    <p className="text-muted-foreground text-sm">Manage monthly fees and billing status</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search shops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-secondary/50 border border-transparent focus:border-border rounded-lg text-sm w-full md:w-64 outline-none transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-3">Shop Name</th>
                                    <th className="px-6 py-3">Monthly Fee</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Last Paid</th>
                                    <th className="px-6 py-3">Next Billing</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredShops.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                                            No shops found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredShops.map((shop) => (
                                        <tr key={shop.id} className="hover:bg-secondary/30 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {shop.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                ₹{shop.monthly_fee}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                    shop.status === 'paid'
                                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}>
                                                    {shop.status.toUpperCase()}
                                                </span>
                                                {shop.isMock && <span className="text-[10px] text-muted-foreground ml-2">(Demo)</span>}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {shop.last_paid_date ? new Date(shop.last_paid_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {shop.next_billing_date ? new Date(shop.next_billing_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(shop)}
                                                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                                    title="Edit Fee"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                {shop.status !== 'paid' && (
                                                    <button
                                                        onClick={() => handleMarkPaid(shop)}
                                                        className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                                        title="Mark as Paid"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {shop.status === 'paid' && (
                                                    <button
                                                        onClick={() => handleMarkUnpaid(shop)}
                                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Mark as Unpaid"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-semibold text-foreground">Edit Subscription Fee</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                                    Shop Name
                                </label>
                                <div className="text-foreground font-medium">{selectedShop?.name}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                                    Monthly Fee (₹)
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="number"
                                        value={editFee}
                                        onChange={(e) => setEditFee(e.target.value)}
                                        className="w-full bg-secondary/50 border border-transparent focus:border-border rounded-lg pl-10 pr-4 py-2 text-foreground outline-none transition-all"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-secondary/30 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateFee}
                                className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
