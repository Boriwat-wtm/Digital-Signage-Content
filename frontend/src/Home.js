import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const socket = io("http://localhost:4000"); // เปลี่ยน port ให้ตรงกับ realtime-server.js

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [config, setConfig] = useState({});
  const [status, setStatus] = useState({
    systemOn: true,
    imageOn: true,
    textOn: true,
  });

  useEffect(() => {
    let storedOrder = localStorage.getItem("order");

    try {
      if (storedOrder && storedOrder !== "NaN") {
        storedOrder = JSON.parse(storedOrder); // แปลง JSON เป็น Object
        setOrder(storedOrder);
      } else {
        setOrder(null); // ตั้งค่าเริ่มต้นหากไม่มีข้อมูล
      }
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      setOrder(null); // ตั้งค่าเริ่มต้นหากเกิดข้อผิดพลาด
    }
  }, []);

  useEffect(() => {
    if (order && order !== "#") {
      const endTime = new Date(localStorage.getItem("endTime")); // ดึง endTime จาก localStorage
      const timeDuration = parseInt(order.time, 10); // เวลาในนาทีจาก order
      if (!isNaN(endTime.getTime()) && !isNaN(timeDuration)) {
        const startTime = new Date(endTime.getTime() - timeDuration * 60000); // คำนวณเวลาเริ่มต้น
        const startHours = startTime.getHours().toString().padStart(2, "0");
        const startMinutes = startTime.getMinutes().toString().padStart(2, "0");
        const endHours = endTime.getHours().toString().padStart(2, "0");
        const endMinutes = endTime.getMinutes().toString().padStart(2, "0");
        setStartTime(`${startHours}:${startMinutes}`);
        setEndTime(`${endHours}:${endMinutes}`);
      }
    }
  }, [order]);

  useEffect(() => {
    socket.on("configUpdate", (newConfig) => {
      setConfig(newConfig);
    });
    return () => socket.off("configUpdate");
  }, []);

  useEffect(() => {
    // รับสถานะล่าสุด
    socket.on("status", (newStatus) => {
      setStatus(newStatus);
    });
    // cleanup
    return () => socket.off("status");
  }, []);

  const handleSelect = (type) => {
    navigate(`/select?type=${type}`);
  };

  const handleCheckStatus = () => {
    setShowModal(true); // เปิดป๊อปอัป
  };

  const handleCloseModal = () => {
    setShowModal(false); // ปิดป๊อปอัป
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Digital Signage CMS</h1>
        <p>UNIVERSITY OF PHAYAO, THAILAND</p>
      </header>
      <main className="home-main">
        <div className="home-buttons">
          {/* ปุ่มส่งรูป */}
          <div
            className={`home-button${!status.systemOn || !status.imageOn ? " disabled" : ""}`}
            onClick={() => {
              if (status.systemOn && status.imageOn) handleSelect("image");
            }}
            style={{
              border: !status.systemOn || !status.imageOn ? "2px solid #e53935" : undefined,
              position: "relative",
              pointerEvents: !status.systemOn || !status.imageOn ? "none" : "auto",
              opacity: !status.systemOn || !status.imageOn ? 0.6 : 1,
              cursor: !status.systemOn || !status.imageOn ? "not-allowed" : "pointer",
            }}
          >
            <h2>📷 ส่งรูปขึ้นจอ</h2>
            <p>โพสต์รูปของคุณไปที่จอพร้อมข้อความ</p>
            {(!status.systemOn || !status.imageOn) && (
              <div
                style={{
                  color: "#fff",
                  background: "#e53935",
                  borderRadius: 10,
                  padding: "10px 0",
                  fontWeight: "bold",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  border: "2px solidrgb(252, 3, 3)",
                  width: "80%",
                  fontSize: "1.1rem",
                  zIndex: 2,
                  boxShadow: "0 2px 8px rgb(255, 8, 3)",
                }}
              >
                ปิดใช้งานชั่วคราว
              </div>
            )}
          </div>
          {/* ปุ่มส่งข้อความ */}
          <div
            className={`home-button${!status.systemOn || !status.textOn ? " disabled" : ""}`}
            onClick={() => {
              if (status.systemOn && status.textOn) handleSelect("text");
            }}
            style={{
              border: !status.systemOn || !status.textOn ? "2px solid #e53935" : undefined,
              position: "relative",
              pointerEvents: !status.systemOn || !status.textOn ? "none" : "auto",
              opacity: !status.systemOn || !status.textOn ? 0.6 : 1,
              cursor: !status.systemOn || !status.textOn ? "not-allowed" : "pointer",
            }}
          >
            <h2>💬 ส่งข้อความขึ้นจอ</h2>
            <p>โพสต์ข้อความของคุณไปที่จอ</p>
            {(!status.systemOn || !status.textOn) && (
              <div
                style={{
                  color: "#fff",
                  background: "#e53935",
                  borderRadius: 10,
                  padding: "10px 0",
                  fontWeight: "bold",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  border: "2px solid #b71c1c",
                  width: "80%",
                  fontSize: "1.1rem",
                  zIndex: 2,
                  boxShadow: "0 2px 8px rgba(229,57,53,0.15)",
                }}
              >
                ปิดใช้งานชั่วคราว
              </div>
            )}
          </div>
        </div>
        <div className="home-status">
          {order ? (
            <>
              <h2>ลำดับของคุณ: {order.queueNumber} ({order.type === "image" ? "ส่งรูป" : "ส่งข้อความ"}ขึ้นจอ)</h2>
            </>
          ) : (
            <h2>ยังไม่มีลำดับ</h2>
          )}
          <button className="status-button" onClick={handleCheckStatus}>
            เช็คสถานะขึ้นจอ
          </button>
        </div>
      </main>
      <footer className="home-footer">
        <p>© 2025 Digital Signage Content Management System</p>
      </footer>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>ลำดับของคุณ: {order.queueNumber}</h2>
            <p>ประเภท: {order.type === "image" ? "ส่งรูป" : "ส่งข้อความ"}ขึ้นจอ</p>
            <p>เวลา: {startTime} น. - {endTime} น.</p>
            <p>ราคา: {order.price} บาท</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;