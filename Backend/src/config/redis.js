import IORedis from "ioredis";
import { env } from "./env.js";

export const redisConnection = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: null,
});

// if connection is successfull
redisConnection.on("connect", () => {
  console.log("Redis Connection Successful");
});

// if connection fails
redisConnection.on("error", (err) => {
  console.error("Redis Connection Failed", err);
});
