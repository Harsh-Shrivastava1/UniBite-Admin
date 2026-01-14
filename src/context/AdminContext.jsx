import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';
import { mockShops } from '../data/mockShops';
import { mockOrders } from '../data/mockOrders';
import { mockDeliveryPartners } from '../data/mockDelivery';
import { mockEarnings } from '../data/mockEarnings';
import { useToast } from './ToastContext';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const toast = useToast();

    // Helper to load from localStorage or fallback
    const loadState = (key, fallback) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    };

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authStage, setAuthStage] = useState('unauthenticated'); // unauthenticated, 2fa_pending, device_pending, authenticated
    const [isLoading, setIsLoading] = useState(true);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [loginActivity, setLoginActivity] = useState([
        { id: 1, date: 'Today 10:21 PM', device: 'Chrome Windows', location: 'Ahmedabad, India', status: 'Success' },
        { id: 2, date: 'Today 10:19 PM', device: 'Unknown Linux', location: 'Delhi, India', status: 'Failed' },
        { id: 3, date: 'Yesterday', device: 'Safari MacOS', location: 'Mumbai, India', status: 'Success' },
    ]);

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            setAuthStage('authenticated');
        }
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        return new Promise((resolve, reject) => {
            // Check for brute force lock (mock check here, UI handles timer)
            if (failedAttempts >= 3) {
                reject('Too many attempts. Account locked.');
                return;
            }

            setTimeout(() => {
                if (username === 'admin123' && password === '123') {
                    setAuthStage('2fa_pending');
                    // setIsAuthenticated(true); // Don't set true yet
                    toast.info('Credentials verified. Enter 2FA code.');
                    resolve(true);
                } else {
                    setFailedAttempts(prev => prev + 1);
                    setLoginActivity(prev => [{
                        id: Date.now(),
                        date: new Date().toLocaleString(),
                        device: 'Current Device',
                        location: 'Unknown',
                        status: 'Failed'
                    }, ...prev]);
                    reject('Invalid credentials');
                }
            }, 800);
        });
    };

    const verify2FA = async (code) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (code === '123456') {
                    setAuthStage('device_pending');
                    toast.success('2FA Verified.');
                    resolve(true);
                } else {
                    reject('Invalid code');
                }
            }, 600);
        });
    };

    const verifyDevice = (trusted) => {
        if (trusted) {
            localStorage.setItem('auth', 'true');
            setIsAuthenticated(true);
            setAuthStage('authenticated');
            setLoginActivity(prev => [{
                id: Date.now(),
                date: new Date().toLocaleString(),
                device: 'Chrome Windows',
                location: 'Ahmedabad, India',
                status: 'Success'
            }, ...prev]);
            toast.success('Device Trusted. Welcome Admin.');
        } else {
            logout();
            toast.error('Access Denied.');
        }
    };

    const logout = () => {
        localStorage.removeItem('auth');
        setIsAuthenticated(false);
        setAuthStage('unauthenticated');
        setFailedAttempts(0);
        toast.info('Logged out successfully.');
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
    // Data States with Persistence
    const [users, setUsers] = useState(() => loadState('users', mockUsers));
    const [shops, setShops] = useState(() => loadState('shops', mockShops));
    const [orders, setOrders] = useState(() => loadState('orders', mockOrders));
    const [deliveryPartners, setDeliveryPartners] = useState(() => loadState('deliveryPartners', mockDeliveryPartners));
    const [earnings, setEarnings] = useState(() => loadState('earnings', mockEarnings));
    // Expanded Settings State
    const [settings, setSettings] = useState(() => loadState('settings', {
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
    }));

    const [systemLogs, setSystemLogs] = useState(() => loadState('systemLogs', [
        { id: 1, action: 'System Backup', performedBy: 'System', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'Success' },
        { id: 2, action: 'Update Platform Commission', performedBy: 'Super Admin', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'Success' },
        { id: 3, action: 'Failed Login Attempt', performedBy: 'Unknown', date: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), status: 'Warning' },
    ]));

    // Persistence Effects
    useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('shops', JSON.stringify(shops)), [shops]);
    useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
    useEffect(() => localStorage.setItem('deliveryPartners', JSON.stringify(deliveryPartners)), [deliveryPartners]);
    useEffect(() => localStorage.setItem('earnings', JSON.stringify(earnings)), [earnings]);
    useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
    useEffect(() => localStorage.setItem('systemLogs', JSON.stringify(systemLogs)), [systemLogs]);

    // Sidebar Actions
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    // Computed Stats (Dynamic)
    const stats = {
        totalRevenue: orders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + Number(o.amount), 0),
        activeOrders: orders
            .filter(o => ['pending', 'accepted', 'ready', 'picked', 'preparing'].includes(o.status)).length,
        totalOrders: orders.length,
        totalUsers: users.length,
        activeShops: shops.filter(s => s.status === 'approved').length,
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
    const addUser = (user) => {
        const newUser = { ...user, id: Date.now(), joinDate: new Date().toISOString().split('T')[0], status: 'active' };
        setUsers([newUser, ...users]);
        toast.success("User added successfully.");
        logAction(`Added new user: ${user.name}`);
    };
    const blockUser = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: 'blocked' } : u));
        toast.info("User blocked.");
        logAction(`Blocked user ID: ${id}`, 'Warning');
    };
    const unblockUser = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
        toast.success("User unblocked.");
        logAction(`Unblocked user ID: ${id}`);
    };
    const deleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
        toast.warning("User deleted.");
        logAction(`Deleted user ID: ${id}`, 'Warning');
    };

    // Shop Actions
    const addShop = (shop) => {
        setShops([{ ...shop, id: Date.now(), status: 'pending', revenue: 0, rating: 0, image: "https://images.unsplash.com/photo-1472851294608-415522f96319?w=800&auto=format&fit=crop&q=60", menu: [] }, ...shops]);
        toast.success("Shop application received.");
        logAction(`Added new shop: ${shop.name}`);
    };
    const editShop = (id, updates) => {
        setShops(shops.map(s => s.id === id ? { ...s, ...updates } : s));
        toast.success("Shop details updated.");
        logAction(`Updated shop details for ID: ${id}`);
    };
    const toggleShopStatus = (id) => {
        setShops(shops.map(s => {
            if (s.id === id) {
                const newStatus = s.status === 'approved' ? 'disabled' : 'approved';
                toast.success(`Shop ${newStatus === 'approved' ? 'enabled' : 'disabled'}.`);
                logAction(`Shop ${s.name} ${newStatus}`);
                return { ...s, status: newStatus };
            }
            return s;
        }));
    };
    const deleteShop = (id) => {
        setShops(shops.filter(s => s.id !== id));
        toast.warning("Shop deleted.");
        logAction(`Deleted shop ID: ${id}`, 'Warning');
    };

    // Menu Actions
    const updateShopMenu = (shopId, menuItems) => {
        setShops(shops.map(s => s.id === shopId ? { ...s, menu: menuItems } : s));
        // logAction(`Updated menu for shop ID: ${shopId}`); // Too verbose if called often
    };

    const toggleMenuItemAvailability = (shopId, itemId) => {
        setShops(shops.map(s => {
            if (s.id === shopId) {
                const updatedMenu = s.menu.map(item =>
                    item.id === itemId ? { ...item, available: !item.available } : item
                );
                return { ...s, menu: updatedMenu };
            }
            return s;
        }));
        toast.success("Item availability updated.");
    };

    const addMenuItem = (shopId, item) => {
        setShops(shops.map(s => {
            if (s.id === shopId) {
                return { ...s, menu: [...s.menu, { ...item, id: Date.now() }] };
            }
            return s;
        }));
        toast.success("Menu item added.");
        logAction(`Added menu item to shop ID: ${shopId}`);
    };

    const deleteMenuItem = (shopId, itemId) => {
        setShops(shops.map(s => {
            if (s.id === shopId) {
                return { ...s, menu: s.menu.filter(m => m.id !== itemId) };
            }
            return s;
        }));
        toast.success("Menu item deleted.");
    };

    // Order Actions
    const updateOrderStatus = (id, status) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));

        // If delivered, maybe trigger earnings update logic?
        // (Currently earnings are computed on-the-fly in 'stats', so no separate state update needed unless we track deeper analytics)

        toast.success(`Order #${id} marked as ${status}.`);
        logAction(`Order #${id} status changed to ${status}`);
    };

    // Delivery Partner Actions
    const addDeliveryPartner = (partner) => {
        setDeliveryPartners([{ ...partner, id: Date.now(), status: 'active', completedDeliveries: 0, rating: 5.0, joinDate: 'Just now' }, ...deliveryPartners]);
        toast.success("Partner added.");
        logAction(`Added delivery partner: ${partner.name}`);
    };
    const blockDeliveryPartner = (id) => {
        setDeliveryPartners(deliveryPartners.map(p => p.id === id ? { ...p, status: 'blocked' } : p));
        toast.info("Partner blocked.");
        logAction(`Blocked delivery partner ID: ${id}`, 'Warning');
    };
    const removeDeliveryPartner = (id) => {
        setDeliveryPartners(deliveryPartners.filter(p => p.id !== id));
        toast.warning("Partner removed.");
        logAction(`Removed delivery partner ID: ${id}`, 'Warning');
    };

    // Settings Actions
    const updateSettings = (key, value, section = null) => {
        if (section) {
            setSettings(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: value
                }
            }));
        } else {
            setSettings(prev => ({ ...prev, [key]: value }));
        }
        // Minimal toast for significant changes
    };

    const addSystemLog = logAction; // Alias for compatibility if needed

    const clearCache = () => {
        toast.success("System cache cleared successfully.");
        logAction("Clear System Cache");
    };

    const resetSystem = () => {
        // Reset to mocks
        if (window.confirm("Are you sure? This will reload the page.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <AdminContext.Provider value={{
            isSidebarOpen, toggleSidebar, closeSidebar, isSidebarCollapsed, toggleCollapse,
            isAuthenticated, authStage, isLoading, failedAttempts, loginActivity,
            login, verify2FA, verifyDevice, logout,

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
