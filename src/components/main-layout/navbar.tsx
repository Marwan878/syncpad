import { Container, Logo } from "@/components/ui";
import Links from "./links";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container as="nav" className="flex h-16 items-center justify-between">
        <Logo />
        <Links />
      </Container>
    </header>
  );
}
