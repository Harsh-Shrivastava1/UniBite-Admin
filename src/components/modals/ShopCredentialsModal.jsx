import { Copy, Check, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const ShopCredentialsModal = ({ isOpen, onClose, credentials, shopName }) => {
    const [copiedId, setCopiedId] = useState(false);
    const [copiedPass, setCopiedPass] = useState(false);

    if (!isOpen || !credentials) return null;

    const copyToClipboard = (text, isId) => {
        navigator.clipboard.writeText(text);
        if (isId) {
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } else {
            setCopiedPass(true);
            setTimeout(() => setCopiedPass(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-white/10 rounded-xl shadow-2xl w-full max-w-md p-0 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900/20 to-black p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Shop Credentials</h3>
                            <p className="text-xs text-muted-foreground">Access for {shopName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-500">
                        ⚠️ Copy these credentials now. They will not be shown again.
                    </div>

                    {/* Login ID */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Login ID</label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-lg font-mono text-emerald-400">
                                {credentials.loginId}
                            </code>
                            <button
                                onClick={() => copyToClipboard(credentials.loginId, true)}
                                className="p-3 bg-secondary hover:bg-white/10 rounded-lg border border-white/5 transition-all text-foreground"
                                title="Copy ID"
                            >
                                {copiedId ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-lg font-mono text-emerald-400">
                                {credentials.password}
                            </code>
                            <button
                                onClick={() => copyToClipboard(credentials.password, false)}
                                className="p-3 bg-secondary hover:bg-white/10 rounded-lg border border-white/5 transition-all text-foreground"
                                title="Copy Password"
                            >
                                {copiedPass ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-secondary/20 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="w-full bg-foreground text-background font-bold py-3 rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        Done & Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopCredentialsModal;
