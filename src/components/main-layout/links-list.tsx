import { Button } from "../ui";

import Link from "next/link";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

type LinksListProps = {
  className?: string;
};

export default function LinksList({
  className = "",
}: Readonly<LinksListProps>) {
  return (
    <ul className={className}>
      <SignedOut>
        <SignInButton>
          <Button variant="ghost" size="md">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button variant="accent" size="md">
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Button
          as={Link}
          href="/workspaces"
          variant="ghost"
          size="md"
          className="text-base"
        >
          My Workspaces
        </Button>
        <Button
          as={Link}
          href="/shared-workspaces"
          variant="ghost"
          size="md"
          className="text-base"
        >
          Shared Workspaces
        </Button>
        <UserButton
          showName
          appearance={{
            elements: {
              rootBox: "mt-auto md:mt-0 text-base",
            },
          }}
        />
      </SignedIn>
    </ul>
  );
}
