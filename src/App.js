import React from "react";
import { Route,  Routes } from "react-router-dom";
import HomePage from "./HomePage";
import LandingPage from "./MenuPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<LandingPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    
    </div>
  );
}

export default App;
