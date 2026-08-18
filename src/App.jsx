import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/postlogin/dashboard/index.jsx";
import Landing from "./pages/prelogin/Landing";
import Login from "./pages/prelogin/auth/Login";
import Signup from "./pages/prelogin/auth/Signup";
import PostloginLayout from "./layouts/PostloginLayout";
import useAuthStore from "./hooks/useAuthStore";
import AllTransactions from "./pages/postlogin/AllTransactions/index.jsx";
import AnalyticsPage from "./pages/postlogin/Analytics/index.jsx";

const ProtectedRoutes = () => {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<PostloginLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/all-transactions" element={<AllTransactions />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
