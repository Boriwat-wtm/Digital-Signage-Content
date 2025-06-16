require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const twilio = require("twilio");
const axios = require("axios");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const port = 5000;

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const expectedAmount = parseInt(process.env.EXPECTED_AMOUNT, 10); // จำนวนเงินที่คาดหวัง

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// API สำหรับอัปโหลดรูปภาพและข้อความ
app.post("/upload-content", upload.single("image"), (req, res) => {
  const { message } = req.body;
  const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  console.log("Message:", message);
  console.log("Image URL:", imageUrl);

  res.json({ success: true, message, imageUrl });
});

// API เดิมสำหรับอัปโหลดรูปภาพ
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Endpoint สำหรับส่ง OTP
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "กรุณาระบุหมายเลขโทรศัพท์" });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "หมายเลขโทรศัพท์ไม่ถูกต้อง" });
  }

  var axios = require('axios');
  var config = {
    method: 'post',
    url: 'https://portal-otp.smsmkt.com/api/otp-send',
    headers: {
      "Content-Type": "application/json",
      "api_key": "2607fce6276d1f68e8d543e953d76bc4",
      "secret_key": "5yX5m9LcHVNks99i",
    },
    data: JSON.stringify({
      "project_key": "69a425bf4f",
      "phone": phone, // ใช้เบอร์โทรศัพท์ที่ส่งมาจาก Frontend
    })
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data)); // พิมพ์การตอบกลับจาก SMSMKT

    if (response.data.code === "000") {
      res.json({
        success: true,
        message: "OTP ส่งสำเร็จ",
        token: response.data.result.token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.detail,
      });
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message || error);
    res.status(500).json({ success: false, message: "ไม่สามารถส่ง OTP ได้" });
  }
});

// ตรวจสอบ OTP
app.post("/verify-otp", async (req, res) => {
  const { otp, token } = req.body;

  if (!otp || !token) {
    return res.status(400).json({ success: false, message: "กรุณาระบุ OTP และ token" });
  }

  const verifyData = {
    otp_code: otp, // OTP ที่ผู้ใช้กรอก
    token: token,  // Token ที่ได้รับจาก SMSMKT
    ref_code: "",  // ไม่จำเป็นต้องใช้ ref_code
  };

  const config = {
    method: "post",
    url: "https://portal-otp.smsmkt.com/api/otp-validate",
    headers: {
      "Content-Type": "application/json",
      api_key: "2607fce6276d1f68e8d543e953d76bc4",
      secret_key: "5yX5m9LcHVNks99i",
    },
    data: JSON.stringify(verifyData),
  };

  try {
    const response = await axios(config);

    if (response.data.code === "000") {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      console.error("SMSMKT Error:", response.data.detail);
      res.status(400).json({ success: false, message: response.data.detail });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.message || error);
    res.status(500).json({ success: false, message: "ไม่สามารถตรวจสอบ OTP ได้" });
  }
});

// ตรวจสอบการชำระเงิน
app.post("/verify-payment", (req, res) => {
  const { amount, method } = req.body;

  if (!amount || !method) {
    return res.status(400).json({ success: false, message: "กรุณาระบุจำนวนเงินและวิธีการชำระเงิน" });
  }

  // ตรวจสอบว่าจำนวนเงินตรงกับราคาที่กำหนดหรือไม่
  if (amount === expectedAmount && method === "promptpay") {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Socket.IO setup
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

let config = {
  enableImage: true,
  enableText: true,
  price: 100,
  time: 10
};

io.on("connection", (socket) => {
  // ส่ง config ปัจจุบันให้ client ทุกครั้งที่เชื่อมต่อ
  socket.emit("configUpdate", config);

  // รับ config ใหม่จากแอดมิน
  socket.on("adminUpdateConfig", (newConfig) => {
    config = { ...config, ...newConfig };
    io.emit("configUpdate", config); // broadcast ให้ทุก client
  });
});

server.listen(port, () => {
  console.log(`Server + WebSocket running on http://localhost:${port}`);
});