import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ImageGeneration from "./pages/ImageGeneration";
import { useAuth } from "./context/AuthContext";
import CampaignGeneration from "./pages/CampaignGeneration";
import Navbar from "./components/Navbar";
import AudioPage from "./pages/AudioPage";

const ProtectedRoute = ({ children }) => {
  const { user, authEnabled } = useAuth();
  if (!authEnabled) return children;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden text-white">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/image"
          element={
            <ProtectedRoute>
              <div className="pt-24 h-screen">
                <ImageGeneration />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaign"
          element={
            <ProtectedRoute>
              <div className="pt-24 h-screen">
                <CampaignGeneration />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Audio Placeholder */}
        <Route
          path="/audio"
          element={
            <ProtectedRoute>
              <div className="pt-24 h-screen">
                <AudioPage />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
