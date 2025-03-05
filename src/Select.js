import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./Select.css";

function Select() {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const [selectedOption, setSelectedOption] = useState(null);
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSelect = (time, price, index) => {
    setTime(time);
    setPrice(price);
    setSelectedOption(index);
    setAlertMessage(""); // Clear alert message when an option is selected
  };

  const handleNext = () => {
    if (selectedOption === null) {
      setAlertMessage("โปรดเลือกเวลา");
    } else {
      history.push(`/upload?type=${type}&time=${time}&price=${price}`);
    }
  };

  return (
    <div className="select-container">
      <header className="select-header">
        <h1>เลือกเวลาและราคา</h1>
      </header>
      <main className="select-main">
        <div className="select-options">
          <div
            className={`select-option ${selectedOption === 0 ? "selected" : ""}`}
            onClick={() => handleSelect("1m", "100", 0)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>1 นาที</h2>
            <p>ราคา: 100 บาท</p>
            {selectedOption === 0 && <span className="check-icon">✔</span>}
          </div>
          <div
            className={`select-option ${selectedOption === 1 ? "selected" : ""}`}
            onClick={() => handleSelect("2m", "150", 1)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>2 นาที</h2>
            <p>ราคา: 150 บาท</p>
            {selectedOption === 1 && <span className="check-icon">✔</span>}
          </div>
          <div
            className={`select-option ${selectedOption === 2 ? "selected" : ""}`}
            onClick={() => handleSelect("3m", "200", 2)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>3 นาที</h2>
            <p>ราคา: 200 บาท</p>
            {selectedOption === 2 && <span className="check-icon">✔</span>}
          </div>
          <div
            className={`select-option ${selectedOption === 3 ? "selected" : ""}`}
            onClick={() => handleSelect("4m", "250", 3)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>4 นาที</h2>
            <p>ราคา: 250 บาท</p>
            {selectedOption === 3 && <span className="check-icon">✔</span>}
          </div>
        </div>
        {alertMessage && <p className="alert-message">{alertMessage}</p>}
        <button className="next-button" onClick={handleNext}>ถัดไป</button>
      </main>
      <footer className="select-footer">
        <p>© 2025 Ditital Sinage Content Management System</p>
      </footer>
    </div>
  );
}

export default Select;