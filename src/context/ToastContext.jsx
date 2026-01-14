import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
                {toasts.map((t) => (
                    <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-foreground" />, // Monochrome: white check
        error: <AlertCircle className="w-5 h-5 text-foreground" />,
        info: <Info className="w-5 h-5 text-foreground" />,
        warning: <AlertTriangle className="w-5 h-5 text-foreground" />
    };

    return (
        <div className="flex items-center w-full max-w-sm bg-card border border-border shadow-lg rounded-xl pointer-events-auto overflow-hidden animate-in slide-in-from-right-full duration-300">
            <div className="flex-1 p-4 flex items-center">
                <div className="mr-3 p-2 bg-secondary rounded-full border border-border">
                    {icons[type]}
                </div>
                <p className="text-sm font-medium text-foreground">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="p-4 border-l border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
