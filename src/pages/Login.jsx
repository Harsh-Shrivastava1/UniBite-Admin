import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Lock, Eye, EyeOff, Shield, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, failedAttempts } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    // Brute force lockout state
    const isLocked = failedAttempts >= 3;
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (isLocked) {
            setCountdown(30);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0; // In a real app, we'd reset attempts or require admin reset
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLocked]);

    // Shake animation state
    const [shake, setShake] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            navigate('/2fa'); // Redirect to 2FA instead of dashboard
        } catch (err) {
            setError(err);
            setIsLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    return (
        <div className="min-h-screen bg-black text-foreground flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 2px, 3px 100%'
            }}></div>

            <div className={clsx(
                "relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl transition-transform duration-300",
                shake ? "animate-shake" : ""
            )}>
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse-slow">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Admin Access</h1>
                    <p className="text-sm text-neutral-400">Enter your secure credentials to continue.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="peer w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="Username"
                                autoComplete="username"
                            />
                            <label
                                htmlFor="username"
                                className="absolute left-4 top-3 text-neutral-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1 pointer-events-none peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white peer-not-placeholder-shown:bg-black peer-not-placeholder-shown:px-1"
                            >
                                Username
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all pr-12"
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 top-3 text-neutral-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1 pointer-events-none peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white peer-not-placeholder-shown:bg-black peer-not-placeholder-shown:px-1"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="w-4 h-4 border border-white/20 rounded bg-transparent peer-checked:bg-white peer-checked:border-white transition-all"></div>
                                <ArrowRight className="w-3 h-3 text-black absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">Remember me</span>
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg text-sm animate-fade-in-up">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || (isLocked && countdown > 0)}
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (isLocked && countdown > 0) ? (
                            <span className="text-red-500 font-bold">Try again in {countdown}s</span>
                        ) : (
                            <>
                                <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">Secure Login</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center space-x-2 text-neutral-500 text-xs uppercase tracking-widest mb-2">
                        <Shield className="w-3 h-3" />
                        <span>Secured by Unibite</span>
                    </div>
                    <p className="text-[10px] text-neutral-600">
                        This system is monitored. Unauthorized access is prohibited.<br />
                        IP: {`192.168.1.${Math.floor(Math.random() * 255)}`} &bull; Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Styles for shake animation */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Login;
