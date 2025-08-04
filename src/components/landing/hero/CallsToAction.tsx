import { Button } from "@/components/ui";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function CallsToAction() {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <SignUpButton>
        <Button variant="primary">Get Started Free</Button>
      </SignUpButton>

      <SignInButton>
        <button className="text-sm font-semibold leading-6 text-text-primary hover:text-brand transition-colors">
          Sign In <span aria-hidden="true">→</span>
        </button>
      </SignInButton>
    </div>
  );
}
