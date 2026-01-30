import express from "express";
import { emailQueue } from "../queues/emailQueue.js";
import { createEmail, getAllEmails } from "../services/email.service.js";

const router = express.Router();

// schedule an email

router.post("/schedule", async (req, res) => {
  try {
    const { to, subject, body, scheduledAt } = req.body;

    // basic validation
    if (!to || !subject || !body || !scheduledAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // validate date format
    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid scheduledAt format. Use ISO-8601 UTC format.",
      });
    }

    // validate future time
    const delay = parsedDate.getTime() - Date.now();
    if (delay < 0) {
      return res
        .status(400)
        .json({ message: "Scheduled time must be in the future" });
    }

    // save email in DB
    const email = await createEmail({
      to,
      subject,
      body,
      scheduledAt: parsedDate,
    });

    // add job to queue
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
        jobId: email.id,
        attempts: 3,
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

// get all emails

router.get("/", async (req, res) => {
  try {
    const emails = await getAllEmails();
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
});

export default router;
