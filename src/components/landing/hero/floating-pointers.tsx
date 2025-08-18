import Pointer from "@/components/ui/pointer";

export default function FloatingPointers() {
  return (
    <>
      <Pointer
        wrapperClassName="bottom-23 end-0 text-brand animate-sway hidden lg:flex"
        username="Josh"
      />

      <Pointer
        wrapperClassName="top-48 -end-22 text-accent animate-sway hidden lg:flex"
        username="Mohammed"
      />

      <Pointer
        wrapperClassName="top-42 -start-20 text-violet-700 animate-sway-inverted hidden lg:flex"
        username="Heba"
        inverted
      />

      <Pointer
        wrapperClassName="bottom-19 -start-22 text-yellow-500 animate-sway-inverted hidden lg:flex"
        username="Mary"
        inverted
      />
    </>
  );
}
