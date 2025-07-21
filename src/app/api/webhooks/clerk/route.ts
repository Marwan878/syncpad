import { User } from "@/types/user";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

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

    const HASURA_URL = process.env.HASURA_URL;
    const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

    if (!HASURA_URL || !HASURA_ADMIN_SECRET) {
      const errorMessage = !HASURA_URL
        ? "HASURA_URL is not set"
        : "HASURA_ADMIN_SECRET is not set";

      return NextResponse.json(
        {
          message: errorMessage,
          success: false,
        },
        {
          status: 500,
        }
      );
    }

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
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      avatarUrl: image_url,
      created_at: new Date(created_at).toISOString(),
    };

    const INSERT_USER = `
      mutation InsertUser($id: String!, $name: String!, $email: String!, $avatarUrl: String!, $created_at: timestamptz!) {
        insert_users_one(object: {
          id: $id,
          name: $name,
          email: $email,
          avatar_url: $avatarUrl,
          created_at: $created_at
        }) {
          id
        }
      }
    `;

    const response = await fetch(HASURA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: INSERT_USER,
        variables: newUser,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Error inserting user:", data.errors);
      return NextResponse.json(
        {
          message: "Error inserting user",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User inserted in database successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
