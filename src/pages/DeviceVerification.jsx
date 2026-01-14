import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Shield, Laptop, MapPin, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

const DeviceVerification = () => {
    const { verifyDevice } = useAdmin();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleTrust = () => {
        setIsLoading(true);
        setTimeout(() => {
            verifyDevice(true);
            navigate('/dashboard');
        }, 800);
    };

    const handleDeny = () => {
        verifyDevice(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-foreground flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
                        <Shield className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">New Device Detected</h1>
                    <p className="text-sm text-neutral-400">We noticed a login attempt from an unrecognized device.</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-8 space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-black rounded-lg border border-white/10">
                            <Laptop className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Chrome on Windows</p>
                            <p className="text-xs text-neutral-500">Just now</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-black rounded-lg border border-white/10">
                            <MapPin className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Ahmedabad, India</p>
                            <p className="text-xs text-neutral-500">IP: 192.168.1.1</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleTrust}
                        disabled={isLoading}
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center space-x-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span>{isLoading ? 'Verifying...' : 'Trust this device'}</span>
                    </button>
                    <button
                        onClick={handleDeny}
                        className="w-full bg-transparent border border-white/10 text-neutral-400 font-medium py-3 rounded-lg hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all flex items-center justify-center space-x-2"
                    >
                        <XCircle className="w-4 h-4" />
                        <span>Deny access</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceVerification;
