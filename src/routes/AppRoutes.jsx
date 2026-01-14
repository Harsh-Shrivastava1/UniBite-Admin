import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Shops from '../pages/Shops';
import Orders from '../pages/Orders';
import DeliveryPartners from '../pages/DeliveryPartners';
import Earnings from '../pages/Earnings';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import PageWrapper from '../components/layout/PageWrapper';

// Protected Route Mock (Always allows for now, can add mock auth later)
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = true; // Mock
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><PageWrapper><Users /></PageWrapper></ProtectedRoute>} />
            <Route path="/shops" element={<ProtectedRoute><PageWrapper><Shops /></PageWrapper></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><PageWrapper><Orders /></PageWrapper></ProtectedRoute>} />
            <Route path="/delivery" element={<ProtectedRoute><PageWrapper><DeliveryPartners /></PageWrapper></ProtectedRoute>} />
            <Route path="/earnings" element={<ProtectedRoute><PageWrapper><Earnings /></PageWrapper></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;
