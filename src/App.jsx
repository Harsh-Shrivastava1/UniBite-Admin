import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import CommandPalette from './components/ui/CommandPalette';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Shops from './pages/Shops';
import Orders from './pages/Orders';
import DeliveryPartners from './pages/DeliveryPartners';
import Earnings from './pages/Earnings';
import Settings from './pages/Settings';
import TwoFactor from './pages/TwoFactor';
import DeviceVerification from './pages/DeviceVerification';
import LoginActivity from './pages/LoginActivity';
import { ToastProvider } from './context/ToastContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authStage, isLoading } = useAdmin();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Handle multi-step auth redirects
  if (authStage === '2fa_pending' && location.pathname !== '/2fa') {
    return <Navigate to="/2fa" replace />;
  }
  if (authStage === 'device_pending' && location.pathname !== '/verify-device') {
    return <Navigate to="/verify-device" replace />;
  }

  // If not authenticated (and not in a pending stage), go to login
  if (!isAuthenticated && authStage === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Layout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="shops" element={<Shops />} />
            <Route path="orders" element={<Orders />} />
            <Route path="delivery" element={<DeliveryPartners />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="settings" element={<Settings />} />
            <Route path="activity" element={<LoginActivity />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AdminProvider>
          <CommandPalette />
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/2fa" element={<TwoFactor />} />
            <Route path="/verify-device" element={<DeviceVerification />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            } />
          </Routes>
        </AdminProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
