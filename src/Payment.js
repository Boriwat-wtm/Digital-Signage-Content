import React from "react";
import { useHistory } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const history = useHistory();

  const handlePayment = () => {
    alert("การชำระเงินสำเร็จ!");
    history.push("/");
  };

  return (
    <div className="payment-container">
      <header className="payment-header">
        <h1>ชำระเงิน</h1>
      </header>
      <main className="payment-main">
        <p>กรุณาเลือกวิธีการชำระเงิน:</p>
        <div className="payment-methods">
          <button className="prompay-button" onClick={handlePayment}>
            ชำระเงินผ่าน Prompay
          </button>
        </div>
      </main>
      <footer className="payment-footer">
        <p>© 2025 Digital Signage Content Management System</p>
      </footer>
    </div>
  );
}

export default Payment;