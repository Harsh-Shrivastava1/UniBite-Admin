import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Lock, Eye, EyeOff, Shield, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [tfaCode, setTfaCode] = useState('');
    const [step, setStep] = useState(1); // 1 = Creds, 2 = TFA
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loginStep1, loginStep2 } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    // Shake animation state
    const [shake, setShake] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (step === 1) {
                await loginStep1(email, password);
                setStep(2);
                setIsLoading(false);
            } else {
                await loginStep2(tfaCode);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.message || 'Failed to login');
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
                        {step === 1 ? <Lock className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white" />}
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                        {step === 1 ? 'Admin Access' : 'Security Check'}
                    </h1>
                    <p className="text-sm text-neutral-400">
                        {step === 1 ? 'Enter your secure credentials to continue.' : 'Enter 2FA Unique Code'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="relative group">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                    placeholder="Email"
                                    autoComplete="email"
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-3 text-neutral-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white peer-focus:bg-black peer-focus:px-1 pointer-events-none peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white peer-not-placeholder-shown:bg-black peer-not-placeholder-shown:px-1"
                                >
                                    Email
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
                                    required
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
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="tfa"
                                    value={tfaCode}
                                    onChange={(e) => setTfaCode(e.target.value)}
                                    className="peer w-full bg-black/50 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-transparent focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-center tracking-[0.75em] font-mono text-xl"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    autoFocus
                                />
                                {/* Removed floating label to prevent overlap glitches and keep it minimal as per request */}
                            </div>
                            <p className="text-center text-xs text-neutral-500 mt-2">
                                Enter the 6-digit code from your authenticator app
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg text-sm animate-fade-in-up">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                                    {step === 1 ? 'Verify Credentials' : 'Complete Login'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </>
                        )}
                    </button>

                    {step === 2 && (
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); }}
                            className="block w-full text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors mt-4"
                        >
                            Back to credentials
                        </button>
                    )}
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center space-x-2 text-neutral-500 text-xs uppercase tracking-widest mb-2">
                        <Shield className="w-3 h-3" />
                        <span>Secured by EnvGuard</span>
                    </div>
                </div>
            </div>

            {/* Styles for shake animation */}
            <style>{`
                /* Fix for Chrome Autofill Label Overlap */
                input:-webkit-autofill + label {
                    top: -0.625rem !important;
                    font-size: 0.75rem !important;
                    color: white !important;
                    background-color: black !important;
                    padding-left: 0.25rem !important;
                    padding-right: 0.25rem !important;
                }
                
                /* Fix Autofill Background Color to match Theme */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px black inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

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
        </div >
    );
};

export default Login;
