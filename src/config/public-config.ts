import { validateEnvironmentVariable } from "@/lib/utils/validateEnvironmentVariable";

export const publicConfig = {
  api: {
    url: validateEnvironmentVariable(
      "NEXT_PUBLIC_API_URL",
      process.env.NEXT_PUBLIC_API_URL
    ),
  },
};
