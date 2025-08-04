import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Container } from "../ui";

export default function CallToAction() {
  return (
    <section className="bg-brand">
      <Container className="py-24 sm:py-32 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-inverted sm:text-4xl">
          Ready to Transform Your Collaboration?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-text-inverted/90 text-pretty">
          Join SyncPad to create, collaborate, and build amazing things with
          your team!
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <SignUpButton>
            <button className="rounded-md bg-text-inverted px-6 py-3 text-sm font-semibold text-brand shadow-sm hover:bg-text-inverted/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverted transition-colors">
              Start Free Today
            </button>
          </SignUpButton>
          <SignInButton>
            <button className="text-sm font-semibold leading-6 text-text-inverted hover:text-text-inverted/80 transition-colors">
              Already have an account? Sign in <span aria-hidden="true">→</span>
            </button>
          </SignInButton>
        </div>
      </Container>
    </section>
  );
}
