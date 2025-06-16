import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register"; // นำเข้า Register
import Home from "./Home"; // นำเข้า Home
import Select from "./Select"; // นำเข้า Select
import Status from "./Status"; // นำเข้า Status
import Upload from "./Upload"; // นำเข้า Upload
import Payment from "./Payment"; // นำเข้า Payment
import ProfileSetup from "./ProfileSetup"; // นำเข้า ProfileSetup

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> {/* หน้าแรก */}
        <Route path="/home" element={<Home />} /> {/* หน้า Home */}
        <Route path="/select" element={<Select />} /> {/* หน้า Select */}
        <Route path="/status" element={<Status />} /> {/* หน้า Status */}
        <Route path="/upload" element={<Upload />} /> {/* หน้า Upload */}
        <Route path="/payment" element={<Payment />} /> {/* หน้า Payment */}
        <Route path="/profile-setup" element={<ProfileSetup />} /> {/* หน้า Profile Setup */}
      </Routes>
    </Router>
  );  
}

export default App;
