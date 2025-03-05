import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Home.css";

function Home() {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState(localStorage.getItem('order') || '#');
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const storedOrder = localStorage.getItem('order');
    if (storedOrder) {
      setOrder(storedOrder);
    }
  }, []);

  useEffect(() => {
    if (order !== '#') {
      const endTime = new Date(localStorage.getItem('endTime'));
      const startTime = new Date(endTime.getTime() - parseInt(localStorage.getItem('time')) * 60000);
      const startHours = startTime.getHours().toString().padStart(2, '0');
      const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
      const endHours = endTime.getHours().toString().padStart(2, '0');
      const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
      setStartTime(`${startHours}:${startMinutes}`);
      setEndTime(`${endHours}:${endMinutes}`);
    }
  }, [order]);

  const handleSelect = (type) => {
    history.push(`/select?type=${type}`);
  };

  const handleCheckStatus = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Digital Signage CMS</h1>
        <p>UNIVERSITY OF PHAYAO, THAILAND</p>
      </header>
      <main className="home-main">
        <div className="home-buttons">
          <div className="home-button" onClick={() => handleSelect("image")}>
            <h2>📷 ส่งรูปขึ้นจอ</h2>
            <p>โพสต์รูปของคุณไปที่จอพร้อมข้อความ</p>
          </div>
          <div className="home-button" onClick={() => handleSelect("text")}>
            <h2>💬 ส่งข้อความขึ้นจอ</h2>
            <p>โพสต์ข้อความของคุณไปที่จอ</p>
          </div>
        </div>
        <div className="home-status">
          <h2>ลำดับของคุณ {order}</h2>
          <button className="status-button" onClick={handleCheckStatus}>เช็คสถานะขึ้นจอ</button>
        </div>
      </main>
      <footer className="home-footer">
        <p>© 2025 Digital Signage Content Management System</p>
      </footer>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h2>ลำดับของคุณ {order}</h2>
            <p>เวลาที่ระบบจะแสดงขึ้นจอ {startTime} น. - {endTime} น.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;