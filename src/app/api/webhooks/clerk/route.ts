import { handleError } from "@/lib/error";
import { UserService } from "@/lib/services/user-service";
import { User } from "@/types/user";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    // Only handle user.created events
    if (event.type !== "user.created") {
      return NextResponse.json(
        {
          message: "Invalid event type",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    // Create the user data from the event
    const {
      id,
      last_name,
      first_name,
      image_url,
      email_addresses,
      created_at,
    } = event.data;

    const newUser: User = {
      id,
      name: `${first_name} ${last_name}`.trim() || id,
      email: email_addresses[0]?.email_address,
      avatar_url: image_url,
      created_at: new Date(created_at).toISOString(),
    };

    // Create the user in the database
    const userService = UserService.getInstance();
    const user = await userService.createUser(newUser);

    // Return the user
    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
