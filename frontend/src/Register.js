import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(""); // เปลี่ยนจาก refCode เป็น token
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 นาที
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  const otpRefs = Array(6)
    .fill(null)
    .map(() => React.createRef());

  const startCountdown = () => {
    setTimerActive(true);
    let timeLeft = 600; // 10 นาที
    setCountdown(timeLeft);

    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        setTimerActive(false);
      }
    }, 1000);
  };

  const sendOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log("Response from Backend:", data); // ตรวจสอบค่าที่ได้รับจาก Backend

      const tokenFromBackend = data.token || (data.result && data.result.token);
      console.log("Token ที่ได้จาก backend:", tokenFromBackend); // Debug token

      if (response.ok && data.success && tokenFromBackend) {
        setToken(tokenFromBackend); // เก็บ Token ที่ได้รับจาก Backend
        setShowOtpInput(true); // แสดงช่องกรอก OTP
        startCountdown(); // เริ่มตัวจับเวลา
      } else {
        alert(data.message || "ไม่ได้รับ token จากระบบ โปรดลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("ไม่สามารถส่ง OTP ได้");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp, // OTP ที่ผู้ใช้กรอก
          token: token, // Token ที่ได้รับจาก SMSMKT
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("OTP ยืนยันสำเร็จ!");
        navigate("/home"); // เปลี่ยนไปยังหน้า Home
      } else {
        alert(data.message || "OTP ไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("ไม่สามารถตรวจสอบ OTP ได้");
    }
  };

  const handleOtpChange = (index, value) => {
    // ตรวจสอบว่าเป็นตัวเลขเท่านั้น
    if (!/^\d*$/.test(value)) return;

    const otpArray = otp.split("");
    otpArray[index] = value;

    if (value && index < 5) {
      otpRefs[index + 1].current.focus(); // เลื่อนไปช่องถัดไป
    } else if (!value && index > 0) {
      otpRefs[index - 1].current.focus(); // เลื่อนไปช่องก่อนหน้า
    }

    setOtp(otpArray.join(""));
  };

  return (
    <div className="register-container">
      <h1>ลงทะเบียน</h1>
      <div className="register-form">
        <label htmlFor="phone">เบอร์โทรศัพท์</label>
        <div className="phone-input">
          <span>🇹🇭 +66</span>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="กรอกเบอร์โทรศัพท์"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={sendOtp}>ขอรหัส OTP</button>
        {showOtpInput && (
          <div className="otp-form">
            <label htmlFor="otp">รหัส OTP</label>
            <div className="otp-inputs">
              {Array(6)
                .fill("")
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    ref={otpRefs[index]} // เพิ่ม ref
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !e.target.value && index > 0) {
                        otpRefs[index - 1].current.focus(); // เลื่อนไปช่องก่อนหน้าเมื่อกด Backspace
                      }
                    }}
                  />
                ))}
            </div>
            <p className="countdown-timer">
              {timerActive ? `รหัส OTP จะหมดอายุใน ${Math.floor(countdown / 60)}:${countdown % 60}` : "รหัส OTP หมดอายุแล้ว"}
            </p>
            <button onClick={verifyOtp} disabled={!timerActive}>
              ยืนยัน OTP
            </button>
          </div>
        )}
      </div>
      <div>
      </div>
    </div>
  );
}

export default Register;