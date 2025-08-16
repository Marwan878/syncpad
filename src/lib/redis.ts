import { config } from "@/config/private-config";
import { Redis } from "ioredis";

export const redis = new Redis(config.redis.url);
