import { validateEnvironmentVariable } from "@/lib/utils/validateEnvironmentVariable";

export const config = {
  hasura: {
    url: validateEnvironmentVariable("HASURA_URL", process.env.HASURA_URL),
    adminSecret: validateEnvironmentVariable(
      "HASURA_ADMIN_SECRET",
      process.env.HASURA_ADMIN_SECRET
    ),
  },
  clerk: {
    secretKey: validateEnvironmentVariable(
      "CLERK_SECRET_KEY",
      process.env.CLERK_SECRET_KEY
    ),
    publishableKey: validateEnvironmentVariable(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ),
    jwtKey: validateEnvironmentVariable(
      "NEXT_PUBLIC_CLERK_JWT_KEY",
      process.env.NEXT_PUBLIC_CLERK_JWT_KEY
    ),
  },
  app: {
    url: validateEnvironmentVariable(
      "NEXT_PUBLIC_APP_URL",
      process.env.NEXT_PUBLIC_APP_URL
    ),
  },
  api: {
    url: validateEnvironmentVariable(
      "NEXT_PUBLIC_API_URL",
      process.env.NEXT_PUBLIC_API_URL
    ),
  },
  redis: {
    url: validateEnvironmentVariable("REDIS_URL", process.env.REDIS_URL),
  },
} as const;
