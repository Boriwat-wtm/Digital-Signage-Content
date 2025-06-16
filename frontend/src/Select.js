import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Select.css";

function Select() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type"); // ตรวจสอบประเภท (ข้อความหรือรูปภาพ)

  const [selectedOption, setSelectedOption] = useState(null);
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showRestrictions, setShowRestrictions] = useState(false); // สำหรับแสดงป๊อปอัปข้อกำหนด
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelect = (time, price, index) => {
    setTime(time);
    setPrice(price);
    setSelectedOption(index);
    setAlertMessage(""); // Clear alert message when an option is selected
  };

  const handleNext = () => {
    if (isProcessing) return; // ป้องกันการกดซ้ำ
    setIsProcessing(true);

    if (selectedOption === null) {
      setAlertMessage("โปรดเลือกเวลา");
      setIsProcessing(false);
    } else {
      const currentTime = new Date(); // เวลาปัจจุบัน
      const endTime = new Date(currentTime.getTime() + parseInt(time) * 60000); // คำนวณเวลาสิ้นสุด
      localStorage.setItem("endTime", endTime.toISOString()); // บันทึก endTime ในรูปแบบ ISO

      // บันทึกข้อมูลคำสั่งซื้อโดยไม่เพิ่ม queueNumber
      const newOrderValue = JSON.stringify({ type, time, price });
      localStorage.setItem("order", newOrderValue);

      // ส่งไปยังหน้าอัปโหลด
      navigate(`/upload?type=${type}&time=${time}&price=${price}`);
      setIsProcessing(false);
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
            onClick={() => handleSelect("1 นาที", "1", 0)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>1 นาที</h2>
            <p>ราคา: 1 บาท</p>
            {selectedOption === 0 && <span className="check-icon">✔</span>}
          </div>
          <div
            className={`select-option ${selectedOption === 1 ? "selected" : ""}`}
            onClick={() => handleSelect("2 นาที", "2", 1)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>2 นาที</h2>
            <p>ราคา: 2 บาท</p>
            {selectedOption === 1 && <span className="check-icon">✔</span>}
          </div>
          <div
            className={`select-option ${selectedOption === 2 ? "selected" : ""}`}
            onClick={() => handleSelect("3 นาที", "3", 2)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>3 นาที</h2>
            <p>ราคา: 3 บาท</p>
            {selectedOption === 2 && <span className="check-icon">✔</span>}
          </div>
          <div
            className={`select-option ${selectedOption === 3 ? "selected" : ""}`}
            onClick={() => handleSelect("4 นาที", "4", 3)}
          >
            {type === "image" ? <span className="icon">🖼️</span> : <span className="icon">💬</span>}
            <h2>4 นาที</h2>
            <p>ราคา: 4 บาท</p>
            {selectedOption === 3 && <span className="check-icon">✔</span>}
          </div>
        </div>
        {alertMessage && <p className="alert-message">{alertMessage}</p>}

        {/* ปุ่มข้อกำหนด */}
        <button className="restriction-button" onClick={() => setShowRestrictions(true)}>
          ข้อจำกัด
        </button>

        <button className="next-button" onClick={handleNext}>
          ถัดไป
        </button>
      </main>
      <footer className="select-footer">
        <p>© 2025 Digital Signage Content Management System</p>
      </footer>

      {/* ป๊อปอัปข้อกำหนด */}
      {showRestrictions && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowRestrictions(false)}>
              &times;
            </span>
            <h2>ข้อจำกัด{type === "image" ? "รูปภาพ" : "ข้อความ"}</h2>
            <ul>
              {type === "image" ? (
                <>
                  <li>รูปภาพสำหรับการโฆษณาที่ละเมิดกฎหมาย (การพนัน, สินค้าแอลกอฮอล์, การชักชวนลงทุน, ยาเสพติด, สินค้าผิดกฎหมาย)</li>
                  <li>รูปภาพเนื้อหาที่ไม่เหมาะสมหรือลามกอนาจาร</li>
                  <li>รูปภาพที่ใช้ในการแสดงความคิดเห็นหรือจุดยืนละเมิดสิทธิหรือเสรีภาพของบุคคลอื่น</li>
                  <li>รูปภาพที่กระทำการผิดกฎหมายหรือการคุกคาม</li>
                  <li>รูปภาพที่อาจก่อให้เกิดความขัดแย้ง ความรุนแรง ชวนแตกความสามัคคีหรือดูถูกเหยียดหยาม</li>
                  <li>รูปภาพที่มี QR Code หรือลิงก์เป็นส่วนประกอบ</li>
                  <p>* ในกรณีที่มีการใช้ภาพที่ไม่เหมาะสมในเนื้อหาหรือการโฆษณา ทางผู้ให้บริการอาจปฎิเสธการให้บริการและไม่สามารถดำเนินการคืนเงินได้</p>
                </>
              ) : (
                <>
                  <li>ข้อความสำหรับการโฆษณาที่ละเมิดกฎหมาย (การพนัน, สินค้าแอลกอฮอล์, การชักชวนลงทุน, ยาเสพติด, สินค้าผิดกฎหมาย)</li>
                  <li>ข้อความเนื้อหาที่ไม่เหมาะสมหรือลามกอนาจาร</li>
                  <li>ข้อความที่ใช้ในการแสดงความคิดเห็นหรือจุดยืนละเมิดสิทธิหรือเสรีภาพของบุคคลอื่น</li>
                  <li>ข้อความที่กระทำการผิดกฎหมายหรือการคุกคาม</li>
                  <li>ข้อความที่อาจก่อให้เกิดความขัดแย้ง ความรุนแรง ชวนแตกความสามัคคีหรือดูถูกเหยียดหยาม</li>
                  <p>* ในกรณีที่มีการใช้ข้อความที่ไม่เหมาะสมในเนื้อหาหรือการโฆษณา ทางผู้ให้บริการอาจปฎิเสธการให้บริการและไม่สามารถดำเนินการคืนเงินได้</p>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Select;