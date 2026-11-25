import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import ImageGeneration from "./pages/ImageGeneration";
import CampaignGeneration from "./pages/CampaignGeneration";
import Navbar from "./components/Navbar";
import AudioPage from "./pages/AudioPage";

const App = () => {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden text-white">
      <Navbar />
      <Routes>
        {/* Public Showcase Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Navigate to="/image" replace />} />
        <Route path="/signup" element={<Navigate to="/image" replace />} />

        <Route
          path="/image"
          element={
            <div className="pt-24 h-screen">
              <ImageGeneration />
            </div>
          }
        />

        <Route
          path="/campaign"
          element={
            <div className="pt-24 h-screen">
              <CampaignGeneration />
            </div>
          }
        />

        <Route
          path="/audio"
          element={
            <div className="pt-24 h-screen">
              <AudioPage />
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
