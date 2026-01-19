import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';
import { generateShopCredentials } from '../utils/generateCredentials';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const toast = useToast();

    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return localStorage.getItem('isAdminAuthenticated') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isAdminAuthenticated', isAdminAuthenticated);
    }, [isAdminAuthenticated]);

    const verifyCredentials = (email, password) => {
        const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        return email === envEmail && password === envPassword;
    };

    const verifyTFA = (code) => {
        const envTFA = import.meta.env.VITE_ADMIN_TFA;
        return code === envTFA;
    };

    const loginStep1 = async (email, password) => {
        if (verifyCredentials(email, password)) {
            return true;
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const loginStep2 = async (code) => {
        if (verifyTFA(code)) {
            setIsAdminAuthenticated(true);
            toast.success('Admin access granted');
            return true;
        } else {
            throw new Error('Invalid 2FA code');
        }
    };

    const logout = async () => {
        setIsAdminAuthenticated(false);
        // Optional: Also sign out of Supabase if we used it
        await supabase.auth.signOut();
        toast.info('Logged out safely.');
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Initialize from localStorage or default to false
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Persist collapse state whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);


    // Data States


    // Data States
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [earnings, setEarnings] = useState([]);

    // Expanded Settings State
    // Keep local storage for settings for now, or fetch from DB later
    // Expanded Settings State
    const [settings, setSettings] = useState({
        // Operational
        codEnabled: true,
        orderingTimeWindow: '09:00 - 23:00',
        platformActive: true,
        maintenanceMode: false,
        // Security
        security: {
            enforce2FA: false,
            sessionTimeout: '15m', // 15m, 30m, 1h
        },
        // Admin Profile
        admin: {
            name: 'Super Admin',
            email: 'admin@unibite.com'
        },
        // Platform Config
        platform: {
            commission: 10,
            minOrderAmount: 100,
            maxActiveOrders: 50,
            autoAssign: true
        },
        // Feature Flags
        features: {
            ai: false,
            beta: false,
            experimental: false
        }
    });

    const [systemLogs, setSystemLogs] = useState(() => {
        const saved = localStorage.getItem('systemLogs');
        return saved ? JSON.parse(saved) : [];
    });

    // Data Fetching
    const fetchData = async () => {
        if (!isAdminAuthenticated) return; // Only check local auth
        setIsLoading(true);
        try {
            // Fetch Users (Profiles)
            // Schema has 'full_name', code expects 'name'
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*, name:full_name');
            if (!usersError) setUsers(usersData || []);

            // Fetch Shops with Menu
            // Schema has 'menu_items', code used 'shop_menu'
            const { data: shopsData, error: shopsError } = await supabase
                .from('shops')
                .select('*, menu_items(*)');

            if (shopsError) throw shopsError;

            // Transform to match UI expectation (menu property)
            const transformedShops = (shopsData || []).map(shop => ({
                ...shop,
                // Map menu_items to menu, and handle field differences
                menu: (shop.menu_items || []).map(m => ({
                    ...m,
                    image: m.image_url,      // DB: image_url, UI: image
                    available: m.is_available // DB: is_available, UI: available
                }))
            }));
            setShops(transformedShops);

            // Fetch Orders with Joins
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select(`
                *,
                shops (name),
                order_items (*)
            `)
                .order('created_at', { ascending: false });
            if (ordersError) throw ordersError;

            // Map orders to UI format
            const formattedOrders = (ordersData || []).map(order => ({
                ...order,
                shop: order.shops?.name || 'Unknown Shop',
                items: order.order_items?.map(i => `${i.quantity}x ${i.item_name}`) || [],
                amount: order.total_amount,
                user: 'User ' + (order.student_id ? order.student_id.slice(0, 4) : 'Unknown')
            }));
            setOrders(formattedOrders);

            // Fetch Delivery Partners
            const { data: partnersData, error: partnersError } = await supabase
                .from('delivery_profiles')
                .select('*');
            if (partnersError) throw partnersError;
            setDeliveryPartners(partnersData || []);

            // Fetch Transactions/Earnings
            const { data: transactionsData, error: earningsError } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });
            if (earningsError) throw earningsError;

            // Compute Stats
            const completedOrders = (ordersData || []).filter(o => o.status === 'delivered');
            const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const monthlyRevenue = completedOrders
                .filter(o => new Date(o.created_at) >= startOfMonth)
                .reduce((sum, o) => sum + Number(o.amount || 0), 0);

            const todayRevenue = completedOrders
                .filter(o => new Date(o.created_at) >= startOfToday)
                .reduce((sum, o) => sum + Number(o.amount || 0), 0);

            setEarnings({
                stats: {
                    totalRevenue: totalRevenue.toFixed(2),
                    monthly: monthlyRevenue.toFixed(2),
                    today: todayRevenue.toFixed(2)
                },
                history: transactionsData || []
            });

            // Fetch Settings
            const { data: settingsData } = await supabase
                .from('platform_settings')
                .select('*')
                .single();
            if (settingsData && settingsData.config) {
                setSettings(prev => ({ ...prev, ...settingsData.config }));
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchData();
        }
    }, [isAdminAuthenticated]);

    // Realtime Subscriptions
    useEffect(() => {
        if (!isAdminAuthenticated) return;

        const channel = supabase.channel('admin-dashboard')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    toast.info('Orders updated');
                    fetchData();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'shops' },
                () => fetchData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'users' },
                () => fetchData() // Update user counts
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAdminAuthenticated]);

    // Persistence Effects
    // Removed data persistence to rely on DB
    // useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);
    // useEffect(() => localStorage.setItem('shops', JSON.stringify(shops)), [shops]);
    // useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
    // useEffect(() => localStorage.setItem('deliveryPartners', JSON.stringify(deliveryPartners)), [deliveryPartners]);
    // useEffect(() => localStorage.setItem('earnings', JSON.stringify(earnings)), [earnings]);
    // useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
    useEffect(() => localStorage.setItem('systemLogs', JSON.stringify(systemLogs)), [systemLogs]);

    // Sidebar Actions
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    // Computed Stats (Dynamic)
    const stats = {
        totalRevenue: orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + Number(o.amount || 0), 0),
        activeOrders: orders
            .filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
        totalOrders: orders.length,
        totalUsers: users.length, // Placeholder
        activeShops: shops.filter(s => s.is_open).length,
    };

    // --- Actions ---

    // Logging Helper
    const logAction = (action, status = 'Success', performedBy = 'Super Admin') => {
        const newLog = {
            id: Date.now(),
            action,
            performedBy,
            date: new Date().toISOString(),
            status
        };
        setSystemLogs(prev => [newLog, ...prev]);
    };

    // User Actions
    const addUser = async (user) => {
        // Typically handled via Auth, but if just adding to a table:
        const { data, error } = await supabase
            .from('users')
            .insert([{ ...user, join_date: new Date().toISOString() }])
            .select()
            .single();

        if (error) {
            toast.error(error.message);
            return;
        }

        setUsers([data, ...users]);
        toast.success("User added successfully.");
        logAction(`Added new user: ${user.name}`);
    };

    const blockUser = async (id) => {
        const { error } = await supabase
            .from('users')
            .update({ status: 'blocked' })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setUsers(users.map(u => u.id === id ? { ...u, status: 'blocked' } : u));
        toast.info("User blocked.");
        logAction(`Blocked user ID: ${id}`, 'Warning');
    };

    const unblockUser = async (id) => {
        const { error } = await supabase
            .from('users')
            .update({ status: 'active' })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
        toast.success("User unblocked.");
        logAction(`Unblocked user ID: ${id}`);
    };

    const deleteUser = async (id) => {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setUsers(users.filter(u => u.id !== id));
        toast.warning("User deleted.");
        logAction(`Deleted user ID: ${id}`, 'Warning');
    };

    // Shop Actions
    const addShop = async (shop) => {
        const fullPayload = {
            ...shop,
            owner_id: user?.id || '00000000-0000-0000-0000-000000000000',
            is_open: false,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1554679665-f5537f187268?auto=format&fit=crop&q=80&w=600",
            revenue: 0
        };

        try {
            // Try inserting with ALL fields (Optimistic)
            const { data, error } = await supabase
                .from('shops')
                .insert([fullPayload])
                .select()
                .single();

            if (error) throw error;

            // 2. Generate and Store Credentials
            const credentials = generateShopCredentials();

            const { error: authError } = await supabase
                .from('shop_auth')
                .insert([{
                    shop_id: data.id,
                    login_id: credentials.loginId,
                    password: credentials.password
                }]);

            if (authError) {
                console.error("Failed to create shop credentials:", authError);
                toast.error("Shop created but failed to generate credentials. Please check database tables.");
                // We don't return here because the shop itself WAS created.
            }

            setShops([{ ...data, menu: [] }, ...shops]);
            toast.success("Shop added successfully.");
            logAction(`Added new shop: ${shop.name}`);

            // Return credentials to be shown in UI
            return authError ? null : credentials;

        } catch (error) {
            // Check for Schema Mismatch (Missing Column)
            if (error.message?.includes("Could not find the") || error.code === 'PGRST204') {
                console.warn("Schema mismatch detected. Retrying with basic fields...");

                // Fallback: Strip new columns
                const { owner, image, rating, revenue, ...safePayload } = fullPayload;

                const { data: safeData, error: safeError } = await supabase
                    .from('shops')
                    .insert([safePayload])
                    .select()
                    .single();

                if (safeError) {
                    toast.error(safeError.message);
                    return;
                }

                setShops([{ ...safeData, menu: [] }, ...shops]);
                toast.warning("Shop added, but some fields (Image, Owner) were skipped. Please update your Database Schema.");
                logAction(`Added new shop (Basic Mode): ${shop.name}`);
            } else {
                toast.error(error.message);
            }
        }
    };

    const editShop = async (id, updates) => {
        try {
            // Try updating ALL fields
            const { error } = await supabase
                .from('shops')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            setShops(shops.map(s => s.id === id ? { ...s, ...updates } : s));
            toast.success("Shop details updated.");
            logAction(`Updated shop details for ID: ${id}`);

        } catch (error) {
            // Check for Schema Mismatch
            if (error.message?.includes("Could not find the") || error.code === 'PGRST204') {
                console.warn("Schema mismatch detected during update. Retrying...");

                // Fallback: Strip potentially missing columns
                // eslint-disable-next-line no-unused-vars
                const { owner, image, rating, revenue, ...safeUpdates } = updates;

                if (Object.keys(safeUpdates).length === 0) {
                    toast.info("No changes saved. Database missing target columns.");
                    return;
                }

                const { error: safeError } = await supabase
                    .from('shops')
                    .update(safeUpdates)
                    .eq('id', id);

                if (safeError) {
                    toast.error(safeError.message);
                    return;
                }

                setShops(shops.map(s => s.id === id ? { ...s, ...safeUpdates } : s));
                toast.warning("Saved basic details only. Database update required for full features.");
            } else {
                toast.error(error.message);
            }
        }
    };
    const toggleShopStatus = async (id) => {
        const shop = shops.find(s => s.id === id);
        if (!shop) return;

        const newStatus = !shop.is_open;
        const { error } = await supabase
            .from('shops')
            .update({ is_open: newStatus })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setShops(shops.map(s => s.id === id ? { ...s, is_open: newStatus } : s));
        toast.success(`Shop ${newStatus ? 'enabled' : 'disabled'}.`);
        logAction(`Shop ${shop.name} ${newStatus ? 'enabled' : 'disabled'}`);
    };
    const deleteShop = async (id) => {
        const { error } = await supabase
            .from('shops')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setShops(shops.filter(s => s.id !== id));
        toast.warning("Shop deleted.");
        logAction(`Deleted shop ID: ${id}`, 'Warning');
    };

    // Menu Actions
    // Menu Actions
    const updateShopMenu = (shopId, menuItems) => {
        // Legacy or bulk update - optional to implement if needed
        console.warn("Bulk menu update not fully implemented via Supabase yet.");
    };

    const toggleMenuItemAvailability = async (shopId, itemId) => {
        const shop = shops.find(s => s.id === shopId);
        const item = shop?.menu?.find(m => m.id === itemId);
        if (!item) return;

        const newAvailability = !item.available;

        const { error } = await supabase
            .from('menu_items')
            .update({ is_available: newAvailability })
            .eq('id', itemId);

        if (error) {
            toast.error(error.message);
            return;
        }

        setShops(shops.map(s => {
            if (s.id === shopId) {
                const updatedMenu = s.menu.map(m =>
                    m.id === itemId ? { ...m, available: newAvailability } : m
                );
                return { ...s, menu: updatedMenu };
            }
            return s;
        }));
        toast.success("Item availability updated.");
    };

    const addMenuItem = async (shopId, item) => {
        // Ensure price is a number
        const payload = {
            ...item,
            shop_id: shopId,
            price: Number(item.price),
            is_available: true,
            is_veg: true,
            image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        };

        const { data, error } = await supabase
            .from('menu_items')
            .insert([payload])
            .select()
            .single();

        if (error) {
            toast.error(error.message);
            return;
        }

        setShops(shops.map(s => {
            if (s.id === shopId) {
                const newItem = { ...data, image: data.image_url, available: data.is_available };
                return { ...s, menu: [...(s.menu || []), newItem] };
            }
            return s;
        }));
        toast.success("Menu item added.");
        logAction(`Added menu item to shop ID: ${shopId}`);
    };

    const deleteMenuItem = async (shopId, itemId) => {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', itemId);

        if (error) {
            toast.error(error.message);
            return;
        }

        setShops(shops.map(s => {
            if (s.id === shopId) {
                return { ...s, menu: s.menu.filter(m => m.id !== itemId) };
            }
            return s;
        }));
        toast.success("Menu item deleted.");
    };

    // Order Actions
    const updateOrderStatus = async (id, status) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        toast.success(`Order #${id} marked as ${status}.`);
        logAction(`Order #${id} status changed to ${status}`);
    };

    // Delivery Partner Actions
    const addDeliveryPartner = async (partner) => {
        const { data, error } = await supabase
            .from('delivery_profiles')
            .insert([{ ...partner, status: 'active', completed_deliveries: 0, rating: 5.0, join_date: new Date().toISOString() }])
            .select()
            .single();

        if (error) {
            toast.error(error.message);
            return;
        }

        setDeliveryPartners([data, ...deliveryPartners]);
        toast.success("Partner added.");
        logAction(`Added delivery partner: ${partner.name}`);
    };

    const blockDeliveryPartner = async (id) => {
        const { error } = await supabase
            .from('delivery_profiles')
            .update({ status: 'blocked' })
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, status: 'blocked' } : p));
        toast.info("Partner blocked.");
        logAction(`Blocked delivery partner ID: ${id}`, 'Warning');
    };

    const removeDeliveryPartner = async (id) => {
        const { error } = await supabase
            .from('delivery_profiles')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error(error.message);
            return;
        }

        setDeliveryPartners(deliveryPartners.filter(p => p.id !== id));
        toast.warning("Partner removed.");
        logAction(`Removed delivery partner ID: ${id}`, 'Warning');
    };

    // Settings Actions
    const updateSettings = async (key, value, section = null) => {
        let newSettings;
        if (section) {
            newSettings = {
                ...settings,
                [section]: {
                    ...settings[section],
                    [key]: value
                }
            };
        } else {
            newSettings = { ...settings, [key]: value };
        }

        setSettings(newSettings);

        // Persist to Supabase
        try {
            // Check if row exists (upsert)
            // Assuming table 'platform_settings' with id=1 and column 'config' (jsonb)
            await supabase
                .from('platform_settings')
                .upsert({ id: 1, config: newSettings });

        } catch (err) {
            console.error("Failed to persist settings to DB", err);
        }
    };

    const addSystemLog = logAction; // Alias for compatibility if needed

    const clearCache = () => {
        toast.success("System cache cleared successfully.");
        logAction("Clear System Cache");
    };

    const resetSystem = () => {
        // Reload system
        if (window.confirm("Are you sure? This will reload the application.")) {
            // localStorage.clear(); // Opsional: Clear local prefs
            window.location.reload();
        }
    };

    return (
        <AdminContext.Provider value={{
            isSidebarOpen, toggleSidebar, closeSidebar, isSidebarCollapsed, toggleCollapse,
            session, user, isLoading,
            loginStep1, loginStep2, logout, isAdminAuthenticated,

            // Computed
            stats,

            // Data
            users, addUser, blockUser, unblockUser, deleteUser,
            shops, addShop, editShop, toggleShopStatus, deleteShop,
            orders, updateOrderStatus,
            deliveryPartners, addDeliveryPartner, blockDeliveryPartner, removeDeliveryPartner,
            earnings,
            settings, updateSettings,
            systemLogs, addSystemLog, clearCache, resetSystem,

            // New Menu Actions
            toggleMenuItemAvailability, addMenuItem, deleteMenuItem, updateShopMenu
        }}>
            {children}
        </AdminContext.Provider>
    );
};
