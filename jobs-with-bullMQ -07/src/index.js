import express from "express";
import {emailQueue} from "./queue.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || port;


app.post("/welcome-email", (req, res)=>{
    const job = emailQueue.add("send_welcome_email", {
        to: req.body.to,
        name: req.body.name || "Default Name",
        body: req.body.body || "Default Body",
        createdAt: new Date().toISOString()
        },
        {
            attempts: 3, // number of attempts
            backoff: {
                type: "exponential", // backoff strategy
                delay: 5000 // delay in milliseconds
            }
        }
);
    res.json({
        message: "Welcome email job has been added to the queue",
        jobId: job.id
    });
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})