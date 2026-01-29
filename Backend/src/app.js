import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(cors());
app.use(express.json());

// API rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 50,
  }),
);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
