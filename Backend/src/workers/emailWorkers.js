import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("📨 Processing job:", job.id);
    console.log("Payload:", job.data);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

// if successfully completed
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

// when there is error
worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});
