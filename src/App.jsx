import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import ProfilePage from "./pages/ProfilePage";
import Goals from "./pages/Goals";
import NavbarLayout from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      {/*  Toast system should be outside Routes */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes inside Navbar layout */}
        <Route
          element={
            <ProtectedRoute>
              <NavbarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
