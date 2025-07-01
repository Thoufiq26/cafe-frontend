import React from "react";
import { Route,  Routes } from "react-router-dom";
import HomePage from "./HomePage";
import LandingPage from "./MenuPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import About from "./About";
import Contact from "./Contact";

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<LandingPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />


        </Routes>
    
    </div>
  );
}

export default App;
