import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ImageGeneration from "./pages/ImageGeneration";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, session } = useAuth();
  // console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  useEffect(() => {
    // console.log(session);
  }, [session])
  return children;
};

const App = () => {
  const { user } = useAuth();

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

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
