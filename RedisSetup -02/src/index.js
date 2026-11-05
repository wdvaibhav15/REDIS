import express from "express";
import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


const port = process.env.PORT || 3000;

// endpoint to check if Redis is working
app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ message: `Redis is working: ${reply}` });
});

// endpoint to check if MongoDB is working
app.get("/mongo", async (req, res) => {
    const mongourl = process.env.MONGO_URL || "mongodb://localhost:27017/redis-mongo";
    if(mongoose.connection.readyState === 0){
        await mongoose.connect(mongourl);
        res.json({ message: "MongoDB is connected" });
    } else{
        res.json({ message: "MongoDB is already connected" });
    }
})
 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});