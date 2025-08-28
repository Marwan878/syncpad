import Link from "next/link";
import { Button } from "../ui";

export default function ForbiddenMessage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-center text-sm text-gray-500">
        You don&apos;t have permission to this workspace.
      </p>
      <p className="text-center text-sm text-gray-500">
        Ask the workspace owner to add you as a viewer or an editor.
      </p>
      <Button variant="outline" as={Link} href="/">
        Back to home
      </Button>
    </div>
  );
}
