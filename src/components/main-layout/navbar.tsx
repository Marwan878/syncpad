import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Button, Container, Logo } from "@/components/ui";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container as="nav" className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
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
            <Button as={Link} href="/workspaces" variant="ghost" size="md">
              My Workspaces
            </Button>
            <UserButton />
          </SignedIn>
        </div>
      </Container>
    </header>
  );
}
