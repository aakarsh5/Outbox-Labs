import IORedis from "ioredis";
import { env } from "./env.js";

// export const redisConnection = new IORedis({
//   host: env.redisHost,
//   port: Number(env.redisPort),
//   password: env.redisPassword,
//   tls: {},
//   maxRetriesPerRequest: null,
// });

export const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on("connect", () => {
  console.log("Redis Connection Successful");
});

redisConnection.on("ready", () => {
  console.log("Redis Ready");
});

redisConnection.on("error", (err) => {
  console.error("Redis Connection Failed", err);
});
