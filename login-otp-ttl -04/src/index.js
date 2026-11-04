import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phoneNumber) {
  return `otp:${phoneNumber}`;
}

const port = process.env.PORT || 3000;

// endpoint to check if Redis is working
app.post("/sendotp", async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  await redis.set(otpKey(phoneNumber), otp, "EX", 60); // Set OTP with a TTL of 5 minutes (300 seconds)
  res.json({ message: `OTP is set: ${otp}` });
});

// varify the OTP
app.post("/verifyotp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const storedOtp = await redis.get(otpKey(phoneNumber));
  if (!storedOtp) {
    return res.status(401).json({ message: "OTP has expired or does not exist" });
  }

  if (storedOtp !== otp) {
    return res.status(401).json({ message: "OTP is Invalid" });
  } 
  await redis.del(otpKey(phoneNumber)); // Delete the OTP after successful verification
  res.json({ message: "OTP is Valid" });
  
});

// endpoint to get the OTP TTL
app.get("/otp/:phoneNumber/ttl", async (req, res) => {
    // Fixed 'phone' to 'phoneNumber' to match the route param
    const ttl = await redis.ttl(otpKey(req.params.phoneNumber));
    res.json({ ttl });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});