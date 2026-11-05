import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Welcome to the User Profile API");
})

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}`, JSON.stringify(req.body));
    res.send({ savedAs:"json", message: "User profile saved successfully" });
});

app.get("/user/:id/json", async (req, res) => {
    const userProfile = await redis.get(`user:${req.params.id}:json`);
    res.send({ userProfile: userProfile ? JSON.parse(userProfile) : null });
});

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.send({ savedAs:"hash", message: "User profile saved successfully" });
});

app.get("/user/:id/hash", async (req, res) => {
    const userProfile = await redis.hgetall(`user:${req.params.id}:hash`);
    res.send({ userProfile: Object.keys(userProfile).length ? userProfile : null });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});