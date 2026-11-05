import { Worker } from 'bullmq';
import { connection } from './queue.js';

// three properties for the worker
const worker = new Worker(
    "email_queue", // name
    async (job) => {
        console.log("Email worker is processing a job", Job.id, job.name, job.data),// callback or logic
        await new Promise((resolve) => setTimeout(resolve, 1000)), // delay
        console.log("Email worker has completed processing a job", Job.id, job.name, job.data) // completion
    }, // callback or logic
    {connection}
    
);


worker.on("completed", (job) => {
    console.log(`Job with ID ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
    console.log(`Job with ID ${job.id} has failed with error: ${err.message}`);
});