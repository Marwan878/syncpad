import { NextResponse } from "next/server";

export default async function POST(request: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!SIGNING_SECRET) {
    return NextResponse.json(
      {
        message: "CLERK_WEBHOOK_SECRET not set in environment variables",
        success: false,
      },
      { status: 500 }
    );
  }

  console.log(request);
}
