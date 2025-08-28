import {
  Hero,
  Features,
  CallToAction,
  Footer,
  DemoShowcase,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <DemoShowcase />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}
