import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Store,
    ShoppingBag,
    Truck,
    DollarSign,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Command
} from 'lucide-react';
import clsx from 'clsx';
import { useAdmin } from '../../context/AdminContext';
import SidebarItem from './SidebarItem';
import UserProfileImpl from './UserProfileImpl';

const Sidebar = () => {
    const {
        isSidebarOpen,
        closeSidebar,
        isSidebarCollapsed,
        toggleCollapse
    } = useAdmin();

    const [searchQuery, setSearchQuery] = useState('');

    const navigationStructure = [
        {
            section: 'OVERVIEW',
            items: [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            ]
        },
        {
            section: 'MANAGEMENT',
            items: [
                { name: 'Users', path: '/users', icon: Users },
                { name: 'Shops', path: '/shops', icon: Store },
                { name: 'Orders', path: '/orders', icon: ShoppingBag },
                { name: 'Delivery', path: '/delivery', icon: Truck },
            ]
        },
        {
            section: 'ANALYTICS',
            items: [
                { name: 'Earnings', path: '/earnings', icon: DollarSign },
            ]
        },
        {
            section: 'SYSTEM',
            items: [
                { name: 'Settings', path: '/settings', icon: Settings },
            ]
        }
    ];

    // Filter Items based on Search
    const filteredNav = useMemo(() => {
        if (!searchQuery) return navigationStructure;

        const lowerQuery = searchQuery.toLowerCase();

        // Return a flattened list of items that match if searching, or keep structure?
        // Let's keep structure but filter items inside. If a section has no items, drop it.

        return navigationStructure.map(section => ({
            ...section,
            items: section.items.filter(item => item.name.toLowerCase().includes(lowerQuery))
        })).filter(section => section.items.length > 0);

    }, [searchQuery, navigationStructure]);


    const sidebarClasses = clsx(
        // Base
        "fixed md:static inset-y-0 left-0 z-40 bg-card border-r border-border transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col",
        // Mobile
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0",
        // Desktop Collapsed
        isSidebarCollapsed ? "md:w-20" : "md:w-[280px]", // Slightly wider for premium feel
        "w-[280px]"
    );

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden",
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={closeSidebar}
            />

            <div className={sidebarClasses}>
                {/* Header */}
                <div className={clsx(
                    "h-16 flex items-center border-b border-border transition-all duration-300",
                    isSidebarCollapsed ? "justify-center px-0" : "justify-between px-5"
                )}>
                    {!isSidebarCollapsed ? (
                        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-lg shadow-glow-sm">
                                U
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
                                    UNIBITE
                                </h1>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5">
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-xl shadow-glow-sm">
                            U
                        </div>
                    )}

                    {/* Mobile Close */}
                    <button onClick={closeSidebar} className="md:hidden text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Input (Only Visible when Expanded) */}
                {!isSidebarCollapsed && (
                    <div className="px-3 py-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder="Search navigation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary/50 border border-transparent focus:border-border hover:bg-secondary/80 text-sm rounded-lg pl-9 pr-3 py-2 text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-200"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none opacity-50">
                                <Command className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Scrolling Area */}
                <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar space-y-6">
                    {filteredNav.map((section, idx) => (
                        <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                            {/* Section Header */}
                            {!isSidebarCollapsed && !searchQuery && (
                                <h3 className="px-3 mb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    {section.section}
                                </h3>
                            )}

                            {/* Items */}
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <SidebarItem key={item.path} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredNav.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No match found.
                        </div>
                    )}
                </nav>

                {/* Footer Section */}
                <div className="p-3 border-t border-border bg-card">
                    {/* User Profile */}
                    <div className="mb-2">
                        <UserProfileImpl />
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className={clsx(
                            "hidden md:flex items-center w-full p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group",
                            isSidebarCollapsed ? "justify-center" : "justify-between"
                        )}
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {!isSidebarCollapsed && (
                            <span className="text-xs font-medium pl-1">Collapse Sidebar</span>
                        )}
                        <div className={clsx("p-1 rounded-md bg-transparent group-hover:bg-background/50 transition-colors", isSidebarCollapsed && "rotate-180")}>
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                    </button>

                    {!isSidebarCollapsed && (
                        <div className="text-[9px] text-muted-foreground/40 text-center mt-2 font-mono">
                            v2.5.0 build 8492
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
