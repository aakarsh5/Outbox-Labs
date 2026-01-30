import dotenv from "dotenv";

dotenv.config();
export const env = {
  port: process.env.PORT || 5000,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
};
