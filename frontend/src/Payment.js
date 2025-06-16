import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // ใช้ axios สำหรับเรียก API
import "./Payment.css";
import promptpayLogo from "./data-icon/promptpay-logo.png";
import paymentLogo from "./data-icon/payment-logo.jpg"; // นำเข้ารูป payment-logo.jpg
import { incrementQueueNumber } from "./utils";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const time = queryParams.get("time");
  const price = queryParams.get("price");

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleConfirmPayment = () => {
    const currentQueueNumber = incrementQueueNumber(); // เพิ่ม queueNumber ที่นี่

    const newOrder = {
      type,
      time,
      price,
      queueNumber: currentQueueNumber, // ใช้ queueNumber ที่เพิ่มแล้ว
    };
    localStorage.setItem("order", JSON.stringify(newOrder));
    alert("การชำระเงินสำเร็จ!");

    // เปลี่ยนหน้าไปยัง Home
    navigate("/home");
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const sendOtp = async () => {
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      setErrorMessage("กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/send-otp", { phone });
      if (response.data.success) {
        setOtpSent(true);
        setErrorMessage("");
        alert("OTP ถูกส่งไปยังหมายเลขโทรศัพท์ของคุณแล้ว");
      } else {
        setErrorMessage(response.data.message || "ไม่สามารถส่ง OTP ได้");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response || error.message);
      setErrorMessage("ไม่สามารถส่ง OTP ได้");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { phone, otp });
      if (response.data.success) {
        setOtpVerified(true);
        setErrorMessage("");
        alert("OTP ยืนยันสำเร็จ!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response || error.message);
      setErrorMessage("OTP ไม่ถูกต้อง");
    }
  };

  const verifyPaymentAmount = async () => {
    try {
      const response = await axios.post("http://localhost:5000/verify-payment", {
        amount: price, // ส่งราคาที่กำหนดไปตรวจสอบ
        method: "promptpay", // ระบุวิธีการชำระเงิน
      });

      if (response.data.success) {
        setPaymentStatus("success");
        handleConfirmPayment(); // ดำเนินการต่อเมื่อชำระเงินสำเร็จ
      } else {
        setPaymentStatus("failed");
        alert("จำนวนเงินที่โอนไม่ตรงกับราคาที่กำหนด");
      }
    } catch (error) {
      console.error("Error verifying payment:", error.response || error.message);
      setPaymentStatus("failed");
      alert("เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน");
    }
  };

  const handleUploadProof = async (file) => {
    const formData = new FormData();
    formData.append("proof", file);

    try {
      const response = await axios.post("http://localhost:5000/upload-proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("อัปโหลดหลักฐานสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการอัปโหลดหลักฐาน");
      }
    } catch (error) {
      console.error("Error uploading proof:", error.response || error.message);
      alert("เกิดข้อผิดพลาดในการอัปโหลดหลักฐาน");
    }
  };

  const handleNext = () => {
    if (isProcessing) return; // ป้องกันการกดซ้ำ
    setIsProcessing(true); 

    // ...โค้ดอื่น ๆ...

    setIsProcessing(false);
  };

  return (
    <div className="payment-container">
      <header className="payment-header">
        <h1>สรุปรายการคำสั่งซื้อ</h1>
      </header>
      <main className="payment-main">
        <div className="order-summary">
          <h2>Digital Signage CMS</h2>
          <p>ส่ง{type === "image" ? "รูป" : "ข้อความ"}ขึ้นจอ ({time})</p>
          <p>{price} บาท</p>
        </div>

        <h2>วิธีการชำระเงิน</h2>
        <div className="payment-methods">
          <div
            className={`payment-method ${paymentMethod === "promptpay" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("promptpay")}
          >
            <img src={promptpayLogo} alt="Prompt Pay" />
            <p>Prompt Pay</p>
          </div>
          {/* ลบ TrueMoney Wallet ออก */}
        </div>

        <button
          className="confirm-button"
          onClick={() => handlePaymentSelection(paymentMethod)}
          disabled={!paymentMethod}
        >
          ยืนยันการเลือก
        </button>

        {showPopup && paymentMethod === "promptpay" && (
          <div className="popup">
            <div className="popup-content">
              <button className="close-button" onClick={closePopup}>
                X
              </button>
              <h2>ชำระเงินผ่าน Prompt Pay</h2>
              <img src={paymentLogo} alt="Payment Logo" className="payment-logo" />
              <p>โปรดใช้พร้อมเพย์เพื่อชำระเงิน:</p>
              <ol>
                <li>แคปหน้าจอดังกล่าว</li>
                <li>เปิด Mobile Banking App บนมือถือของคุณ</li>
                <li>เลือกไปที่ 'สแกน' หรือ 'คิวอาร์โค้ด' กด 'รูปภาพ'</li>
                <li>เลือกรูปภาพที่คุณแคปไว้และทำการชำระเงิน</li>
                <li>
                  เมื่อชำระเงินเสร็จ กลับมายังหน้าชำระเงิน และรอสักครู่ ระบบจะนำท่านไปยังหน้าชำระเงินสำเร็จ
                </li>
              </ol>
              <button className="confirm-button" onClick={handleConfirmPayment}>
                ยืนยันการชำระเงิน
              </button>
              {paymentStatus && (
                <div className="payment-status">
                  {paymentStatus === "success" ? (
                    <p>การชำระเงินสำเร็จ!</p>
                  ) : paymentStatus === "pending" ? (
                    <p>กำลังตรวจสอบการชำระเงิน...</p>
                  ) : (
                    <p>การชำระเงินล้มเหลว</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ลบ popup TrueMoney Wallet ออก */}
      </main>
      <footer className="payment-footer">
        <p>© 2025 Digital Signage Content Management System</p>
      </footer>
    </div>
  );
}

export default Payment;