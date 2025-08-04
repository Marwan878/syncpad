import {
  Hero,
  Features,
  CallToAction,
  Footer,
  ImageShowcase,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ImageShowcase />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
}
