import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { User, Shield, LogOut, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const UserProfileImpl = () => {
    const { isSidebarCollapsed, logout } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center w-full p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-border hover:bg-secondary/30",
                    isSidebarCollapsed ? "justify-center" : "gap-3"
                )}
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-600 border border-border flex items-center justify-center shadow-inner text-xs font-bold text-white flex-shrink-0">
                    SA
                </div>

                {!isSidebarCollapsed && (
                    <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-medium text-foreground truncate w-full text-left">Super Admin</span>
                        <span className="text-[10px] text-muted-foreground truncate w-full text-left">admin@unibite.com</span>
                    </div>
                )}

                {!isSidebarCollapsed && (
                    <ChevronRight className={clsx("w-4 h-4 text-muted-foreground ml-auto transition-transform", isOpen && "rotate-90")} />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={clsx(
                    "absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-card border border-border rounded-xl shadow-2xl p-1 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200",
                    isSidebarCollapsed ? "left-11 bottom-0 ml-1" : "left-0"
                )}>
                    <div className="px-2 py-1.5 border-b border-border/50 mb-1">
                        <p className="text-xs font-medium text-foreground">My Account</p>
                    </div>

                    <button className="flex items-center w-full px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button className="flex items-center w-full px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </button>

                    <div className="my-1 border-t border-border/50" />

                    <button
                        onClick={logout}
                        className="flex items-center w-full px-2 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-colors gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfileImpl;
