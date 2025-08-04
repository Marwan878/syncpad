import { Container } from "../../ui";
import CallsToAction from "./CallsToAction";
import Description from "./description";
import FloatingPointers from "./floating-pointers";
import Heading from "./heading";

export default function Hero() {
  return (
    <Container
      as="section"
      className="relative pt-14 max-w-2xl py-22 text-center"
    >
      <Heading />
      <Description />
      <CallsToAction />
      <FloatingPointers />
    </Container>
  );
}
