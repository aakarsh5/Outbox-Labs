import express from "express";
import { emailQueue } from "../queues/emailQueue.js";
import { createEmail } from "../services/email.service.js";

const router = express.Router();

// Schedule an email
router.post("/schedule", async (req, res) => {
  try {
    const { to, subject, body, scheduledAt } = req.body;
    // validate format
    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid scheduledAt format. Use ISO-8601 UTC format.",
      });
    }

    if (!to || !subject || !body || !scheduledAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate delay FIRST
    const delay = new Date(scheduledAt).getTime() - Date.now();
    if (delay < 0) {
      return res
        .status(400)
        .json({ message: "Scheduled time must be in the future" });
    }

    // 1️⃣ Save email in DB
    const email = await createEmail({ to, subject, body, scheduledAt });

    // 2️⃣ Add job to queue (SINGLE add, idempotent)
    await emailQueue.add(
      "send-email",
      {
        emailId: email.id,
        to,
        subject,
        body,
      },
      {
        delay,
        jobId: email.id, // idempotency
        attempts: 3, // retries
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    );

    return res.status(201).json({
      message: "Email scheduled successfully",
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
