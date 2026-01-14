import { useRef, useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
    isLoading = false
}) => {
    const modalRef = useRef(null);

    // Close on click outside or escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors border border-transparent"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${isDanger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-foreground text-background hover:bg-foreground/90'
                            }`}
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
