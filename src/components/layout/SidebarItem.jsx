import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAdmin } from '../../context/AdminContext';

const SidebarItem = ({ item }) => {
    const { isSidebarCollapsed, closeSidebar, users, orders, deliveryPartners } = useAdmin();

    const getBadgeCount = (name) => {
        switch (name) {
            case 'Orders':
                // Pending orders
                return orders?.filter(o => o.status === 'Pending').length || 0;
            case 'Users':
                // Blocked users (as per requirements) or maybe Pending approvals? 
                // Requirement says: Users -> blocked count
                return users?.filter(u => u.status === 'blocked').length || 0;
            case 'Delivery':
                // Active deliveries (example logic)
                return deliveryPartners?.filter(d => d.status === 'active').length || 0;
            default:
                return 0;
        }
    };

    const count = getBadgeCount(item.name);

    return (
        <NavLink
            to={item.path}
            onClick={() => window.innerWidth < 768 && closeSidebar()}
            title={isSidebarCollapsed ? item.name : ''}
            className={({ isActive }) =>
                clsx(
                    "flex items-center transition-all duration-200 group relative mb-1",
                    isSidebarCollapsed ? "justify-center px-2 py-3 mx-2 rounded-lg" : "px-3 py-2 mx-3 rounded-md",
                    isActive
                        ? "bg-secondary/50 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground hover:translate-x-1"
                )
            }
        >
            {({ isActive }) => (
                <>
                    {/* Active Indicator Bar (Left) */}
                    {isActive && (
                        <div className={clsx(
                            "absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-foreground rounded-r-full shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-all duration-300",
                            isSidebarCollapsed ? "h-8 -left-2" : "h-6 -left-3"
                        )} />
                    )}

                    <item.icon className={clsx(
                        "transition-all duration-200 flex-shrink-0",
                        isActive ? "text-foreground scale-110" : "group-hover:text-foreground",
                        isSidebarCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                    )} />

                    {!isSidebarCollapsed && (
                        <span className="text-sm truncate flex-1">{item.name}</span>
                    )}

                    {/* Badge */}
                    {!isSidebarCollapsed && count > 0 && (
                        <span className="text-[10px] font-bold bg-secondary text-foreground px-1.5 py-0.5 rounded-full border border-border">
                            {count}
                        </span>
                    )}

                    {/* Collapsed Mode Tooltip (Optional visual enhancement handled by title for now, 
                        but could be a custom tooltip component in future) */}
                </>
            )}
        </NavLink>
    );
};

export default SidebarItem;
