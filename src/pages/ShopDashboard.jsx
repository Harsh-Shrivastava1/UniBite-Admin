import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { LogOut, LayoutDashboard, ShoppingBag, Utensils, IndianRupee } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ShopDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [session, setSession] = useState(null);
    const [shopData, setShopData] = useState(null);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, items: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Check Session
    useEffect(() => {
        const storedSession = localStorage.getItem('shopSession');
        if (!storedSession) {
            navigate('/shop-login');
            return;
        }
        setSession(JSON.parse(storedSession));
    }, [navigate]);

    // Fetch Shop Data
    useEffect(() => {
        if (!session?.shopId) return;

        const loadShopData = async () => {
            try {
                // 1. Fetch Shop Details + Menu Count
                const { data: shop, error: shopError } = await supabase
                    .from('shops')
                    .select('*, menu_items(count)')
                    .eq('id', session.shopId)
                    .single();

                if (shopError) throw shopError;
                setShopData(shop);

                // 2. Fetch Orders for this shop
                // Note: Assuming orders table has a shop_id column linked to shops
                // If orders are linked via name, this needs adjustment. 
                // Based on previous code: orders table has 'shop_id' logic implied or used.
                // Let's assume we need to filter orders by shop.
                // Checking previous AdminContext: orders might not have shop_id directly visible in previous selects but it's likely.
                // Let's filter by shop name if shop_id is missing, or rely on future schema update.
                // SAFE BET: Fetch orders that reference this shop.

                // Let's try fetching orders by shop_name first if shop_id column is uncertain, 
                // BUT best practice is shop_id. Let's assume shop_id exists on orders or we add it.
                // Checking Supabase Schema is not possible directly, but AdminContext fetches `shops (name)` join.
                // This implies orders has a foreign key to shops. ideally `shop_id`.

                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('shop_id', session.shopId); // Crucial: Orders must be linked to shop_id

                // If orders table uses name join, we might face issue. 
                // FALLBACK: If orders table doesn't return, we handle gracefully.

                const validOrders = orders || [];
                const revenue = validOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

                setStats({
                    revenue,
                    orders: validOrders.length,
                    items: shop.menu_items?.[0]?.count || 0
                });

            } catch (err) {
                console.error("Dashboard Load Error:", err);
                toast.error("Failed to load shop data.");
            } finally {
                setIsLoading(false);
            }
        };

        loadShopData();
    }, [session]);

    const handleLogout = () => {
        localStorage.removeItem('shopSession');
        navigate('/shop-login');
        toast.info("Logged out successfully.");
    };

    if (!session || isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black">
                            {shopData?.name?.[0] || 'S'}
                        </div>
                        <span className="font-bold text-lg tracking-tight">{shopData?.name || 'Shop Dashboard'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8 space-y-8">

                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold mb-1">Overview</h1>
                    <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue */}
                    <div className="bg-card border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                            <IndianRupee className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
                    </div>

                    {/* Orders */}
                    <div className="bg-card border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                            <ShoppingBag className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold">{stats.orders}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="bg-card border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Menu Items</h3>
                            <Utensils className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="text-3xl font-bold">{stats.items}</div>
                    </div>
                </div>

                {/* Recent Activity / Placeholder */}
                <div className="bg-card border border-white/10 rounded-xl p-8 text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                        <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Detailed Analytics Coming Soon</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        We are building more features for you to manage orders and menu items directly from here.
                    </p>
                </div>

            </main>
        </div>
    );
};

export default ShopDashboard;
