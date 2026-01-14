import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Users, Store, ShoppingBag, Truck, DollarSign, Settings, X, Command } from 'lucide-react';
import clsx from 'clsx';
import { useAdmin } from '../../context/AdminContext';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { isSidebarOpen } = useAdmin(); // Access context if needed, though mostly independent

    // Toggle with Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small timeout to ensure render
            setTimeout(() => inputRef.current.focus(), 10);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const navigationItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'Navigation' },
        { name: 'Users', path: '/users', icon: Users, section: 'Navigation' },
        { name: 'Shops', path: '/shops', icon: Store, section: 'Navigation' },
        { name: 'Orders', path: '/orders', icon: ShoppingBag, section: 'Navigation' },
        { name: 'Delivery Partners', path: '/delivery', icon: Truck, section: 'Navigation' },
        { name: 'Earnings', path: '/earnings', icon: DollarSign, section: 'Navigation' },
        { name: 'Settings', path: '/settings', icon: Settings, section: 'Navigation' },
    ];

    const filteredItems = navigationItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    // Keyboard navigation
    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredItems[selectedIndex]) {
                handleSelect(filteredItems[selectedIndex].path);
            }
        }
    };

    if (!isOpen) return null;

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Search Header */}
                <div className="flex items-center px-4 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        className="flex-1 h-14 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleInputKeyDown}
                    />
                    <div className="hidden sm:flex items-center gap-1">
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">ESC</span>
                        </kbd>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredItems.length > 0 ? (
                        <>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Navigation
                            </div>
                            {filteredItems.map((item, index) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleSelect(item.path)}
                                    className={clsx(
                                        "w-full flex items-center px-3 py-3 rounded-lg text-sm transition-colors text-left",
                                        index === selectedIndex ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    <span className="flex-1">{item.name}</span>
                                    {index === selectedIndex && (
                                        <Command className="w-3 h-3 text-muted-foreground opacity-50" />
                                    )}
                                </button>
                            ))}
                        </>
                    ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-border bg-secondary/30 text-[10px] text-muted-foreground flex justify-between">
                    <div className="flex gap-4">
                        <span><strong className="text-foreground">↑↓</strong> to navigate</span>
                        <span><strong className="text-foreground">enter</strong> to select</span>
                    </div>
                    <span>Unibite Command</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
