import { Container } from "../ui";
import FloatingIndicator from "../ui/status-indicator";

export default function DemoShowcase() {
  return (
    <Container as="section" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center mb:16 sm:mb-32">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          See SyncPad in <span className="text-yellow-500">Action</span>
        </h2>
        <p className="mt-6 text-lg leading-8 text-text-secondary">
          Experience the clean, intuitive interface designed for seamless
          collaboration and distraction-free productivity.
        </p>
      </div>

      <div className="relative rounded-xl p-2 ring-1 ring-inset ring-background-muted/10 lg:-m-4 lg:rounded-2xl lg:p-4 overflow-hidden bg-white shadow-2xl">
        <video
          src="/demo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
        />

        <FloatingIndicator
          status="connected"
          className="end-4 bottom-4 sm:end-6 sm:bottom-6 text-accent absolute"
        />
      </div>
    </Container>
  );
}
