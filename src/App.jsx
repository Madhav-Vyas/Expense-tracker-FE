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
import { useAuthStore } from "./hooks/useAuthStore";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
