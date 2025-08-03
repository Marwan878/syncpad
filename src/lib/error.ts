import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, "FORBIDDEN");
  }
}

export function handleError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code || "APP_ERROR",
      },
      { status: error.statusCode }
    );
  }

  // Handle unexpected errors
  const isDev = process.env.NODE_ENV === "development";
  return NextResponse.json(
    {
      error: "Internal server error",
      code: "INTERNAL_ERROR",
      ...(isDev && {
        details: error instanceof Error ? error.message : String(error),
      }),
    },
    { status: 500 }
  );
}
