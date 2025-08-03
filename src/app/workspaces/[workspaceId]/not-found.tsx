import { Button } from "@/components/ui";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold text-text-primary mb-2">
        Workspace not found 😥
      </h2>
      <p className="text-text-secondary mb-6">
        The workspace you&apos;re looking for doesn&apos;t exist or you
        don&apos;t have access to it.
      </p>
      <Button
        as={Link}
        href={user ? "/workspaces" : "/"}
        className="inline-flex items-center space-x-2"
        variant="primary"
        size="md"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {user ? <span>Back to Workspaces</span> : <span>Back to Home</span>}
      </Button>
    </div>
  );
}
