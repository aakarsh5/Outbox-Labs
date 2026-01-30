import app from "./app.js";
import { env } from "./config/env.js";
import "./config/redis.js";
import healthRoutes from "./routes/health.routes.js";

app.use("/", healthRoutes);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
