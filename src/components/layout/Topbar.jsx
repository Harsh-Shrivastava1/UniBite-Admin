import { Bell, Search, Menu } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const Topbar = () => {
    const { toggleSidebar } = useAdmin();

    return (
        <header className="sticky top-0 z-30 h-16 px-6 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">

            {/* Left: Mobile Toggle & Check */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 text-muted-foreground hover:text-white hover:bg-secondary rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden sm:block relative group">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users, orders..."
                        className="bg-secondary/50 text-foreground pl-10 pr-4 py-2 rounded-xl border border-transparent focus:border-border focus:bg-secondary focus:ring-1 focus:ring-foreground/20 focus:outline-none w-64 lg:w-96 text-sm transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="relative p-2.5 text-muted-foreground hover:text-white hover:bg-secondary rounded-full transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-foreground rounded-full animate-pulse border border-background"></span>
                </button>

                <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>

                <button className="flex items-center space-x-3 pl-1 pr-2 py-1 rounded-full hover:bg-secondary/50 transition-all border border-transparent hover:border-border/50">
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-xs">
                        SA
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-foreground leading-none">Super Admin</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">admin@unibite.com</p>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
