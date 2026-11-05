import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// key for email queue
const QUEUE_KEY= "email_queue";

// how to put jobs in queues
app.post("/emails", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || "Default Subject",
        body: req.body.body || "Default Body",
        createdAt: new Date().toISOString()
    };
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.send({ message: "Email job added to the queue", job });
});

// how to consume jobs from queues
app.get("/emails", async (req, res) => {
    const job = await redis.rpop(QUEUE_KEY);
    if (!job) {
        return res.status(404).send({ message: "No emails in queue" });
    }
    const rowjob = JSON.parse(job);
    res.send({ message: "Email job retrieved from the queue", job: rowjob });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
