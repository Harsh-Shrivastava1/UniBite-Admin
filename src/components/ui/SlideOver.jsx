import { X } from 'lucide-react';
import clsx from 'clsx';
import { useEffect } from 'react';

const SlideOver = ({ isOpen, onClose, title, children, footer }) => {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className={clsx("fixed inset-0 z-50 overflow-hidden", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
            <div className="absolute inset-0 overflow-hidden">
                {/* Backdrop */}
                <div
                    className={clsx(
                        "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
                        isOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={onClose}
                />

                {/* Panel */}
                <div className={clsx(
                    "pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition duration-300 ease-in-out sm:pl-16",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="w-screen max-w-md flex flex-col bg-card border-l border-border shadow-2xl h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-md">
                            <h2 className="text-lg font-bold text-foreground">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="border-t border-border px-6 py-4 bg-secondary/30">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideOver;
