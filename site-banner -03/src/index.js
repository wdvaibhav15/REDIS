import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const port = process.env.PORT || 3000;

const BANNER_KEY = "site_banner";

// endpoint to check if Redis is working
app.post("/banner", async (req, res) => {
  const { message } = req.body;
  const reply = await redis.set(BANNER_KEY, message || "Default Banner");
  res.json({ message: `Banner is set: ${reply}` });
});

// endpoint to get the banner message
app.get("/banner", async (req, res) => {
  try {
    const bannerMessage = await redis.get(BANNER_KEY);
    
    if (bannerMessage === null) {
      return res.json({ message: "No banner set" });
    } 
    
    return res.json({ message: `Current banner: ${bannerMessage}` });
  } catch (error) {
    console.error("Redis error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// endpoint to delete the banner message
app.delete("/banner", async (req, res) => {
  const reply = await redis.del(BANNER_KEY);
  res.json({ message: `Banner is deleted: ${reply}` });
});

// exist in DB or not
app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ exists: Boolean(exists) });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
