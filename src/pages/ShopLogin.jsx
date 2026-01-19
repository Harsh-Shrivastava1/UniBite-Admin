import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ShopLogin = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Verify Credentials against shop_auth
            const { data, error } = await supabase
                .from('shop_auth')
                .select('shop_id, shops(name)')
                .eq('login_id', loginId)
                .eq('password', password)
                .single();

            if (error || !data) {
                toast.error("Invalid Login ID or Password");
                setIsLoading(false);
                return;
            }

            // 2. Success - Create Session
            const sessionData = {
                shopId: data.shop_id,
                shopName: data.shops?.name,
                loginId: loginId,
                role: 'shop_owner',
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('shopSession', JSON.stringify(sessionData));

            toast.success(`Welcome back, ${data.shops?.name}`);
            navigate('/shop-dashboard');

        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground flex flex-col items-center justify-center p-4">

            {/* Background Details */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md z-10 space-y-8">

                {/* Logo / Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-4 border border-white/10">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Partner Login</h1>
                    <p className="text-muted-foreground">Manage your restaurant, menu and orders.</p>
                </div>

                {/* Login Form */}
                <div className="bg-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleLogin} className="space-y-6">

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5 ml-1">Login ID</label>
                                <input
                                    type="text"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    placeholder="SHOP-XXXXXX"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Access Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Forgot credentials? Contact <span className="text-white font-medium cursor-pointer hover:underline">Unibite Admin Support</span>.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-xs text-white/20">
                        <span>Secure Connection</span>
                        <span>•</span>
                        <span>v2.5.0</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShopLogin;
