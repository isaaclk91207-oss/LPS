import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerQR from "./pages/CustomerQR";
import RewardHistory from "./pages/RewardHistory";
import PointHistory from "./pages/PointHistory";
import BaristaLogin from "./pages/BaristaLogin";
import BaristaDashboard from "./pages/BaristaDashboard";
import QRScanner from "./pages/QRScanner";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerSearch from "./pages/CustomerSearch";
import TransactionHistory from "./pages/TransactionHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Customer Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer/dashboard" element={<ProtectedRoute allowedRole="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/qr" element={<ProtectedRoute allowedRole="customer"><CustomerQR /></ProtectedRoute>} />
        <Route path="/customer/history" element={<ProtectedRoute allowedRole="customer"><RewardHistory /></ProtectedRoute>} />
        <Route path="/customer/points" element={<ProtectedRoute allowedRole="customer"><PointHistory /></ProtectedRoute>} />

        {/* Barista Routes */}
        <Route path="/barista/login" element={<BaristaLogin />} />
        <Route path="/barista/dashboard" element={<ProtectedRoute allowedRole="barista"><BaristaDashboard /></ProtectedRoute>} />
        <Route path="/barista/scan" element={<ProtectedRoute allowedRole="barista"><QRScanner /></ProtectedRoute>} />
        <Route path="/barista/customer/:code" element={<ProtectedRoute allowedRole="barista"><CustomerDetail /></ProtectedRoute>} />
        <Route path="/barista/search" element={<ProtectedRoute allowedRole="barista"><CustomerSearch /></ProtectedRoute>} />
        <Route path="/barista/history" element={<ProtectedRoute allowedRole="barista"><TransactionHistory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
