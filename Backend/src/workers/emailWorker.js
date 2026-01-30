import { Worker } from "bullmq";
import nodemailer from "nodemailer"; // ✅ REQUIRED
import { redisConnection } from "../config/redis.js";
import { updateEmailStatus } from "../services/email.service.js";
import { transporter } from "../utils/mailer.js";

console.log("Worker started and listening to emailQueue");

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { emailId, to, subject, body } = job.data;

    console.log("Job received:", job.id, job.data);

    try {
      const info = await transporter.sendMail({
        from: '"Outbox Labs" <no-reply@outboxlabs.com>',
        to,
        subject,
        text: body,
      });

      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

      await updateEmailStatus(emailId, "SENT", new Date());
      console.log("Email marked as SENT:", emailId);
    } catch (err) {
      console.error("Email failed:", err.message);
      await updateEmailStatus(emailId, "FAILED");
      throw err; // retry
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);
