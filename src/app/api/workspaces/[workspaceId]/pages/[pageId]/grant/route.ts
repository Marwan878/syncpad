import { AuthService } from "@/lib/services/auth-service";
import { handleError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import { KeyService } from "@/lib/services/key-service";
import { WorkspaceService } from "@/lib/services/workspace-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; pageId: string }> }
) {
  try {
    // Authentication
    const authService = AuthService.getInstance();
    const userId = await authService.checkSignedIn(request);

    const { workspaceId } = await params;
    const newData = await request.json();

    const keysService = KeyService.getInstance();

    // Update workspace key
    const key = await keysService.updateKeyByUserIdAndWorkspaceId(
      userId,
      workspaceId,
      newData
    );

    return NextResponse.json(key);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    // Authentication
    const authService = AuthService.getInstance();
    const userId = await authService.checkSignedIn(request);

    const { workspaceId } = await params;

    // Authorization - check if user can access this workspace
    const workspaceService = WorkspaceService.getInstance();
    await workspaceService.checkUserCanView(workspaceId, userId);

    // Get the user's encryption key for this workspace
    const keyService = KeyService.getInstance();
    const keys = await keyService.getKeyByUserIdAndWorkspaceId(
      userId,
      workspaceId
    );

    return NextResponse.json(keys);
  } catch (error) {
    return handleError(error);
  }
}
