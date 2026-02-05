import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ImageGeneration from "./pages/ImageGeneration";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ImageGeneration />
          </ProtectedRoute>
        }
      />

      {/* Public only */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
