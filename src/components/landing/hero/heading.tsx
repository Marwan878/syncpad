"use client";

import Typewriter from "typewriter-effect";

export default function Heading() {
  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter
          .typeString("Simple, ")
          .typeString("<span class='text-accent'>Free,</span>")
          .typeString(" and ")
          .typeString("<span class='text-brand'>Private</span>")
          .typeString(" Collaboration!")
          .pauseFor(500)
          .callFunction((state) => {
            state.elements.cursor.style.display = "none";
          })
          .start();
      }}
      options={{
        wrapperClassName:
          "text-4xl font-bold tracking-tight text-text-primary sm:text-6xl h-32",
        delay: 100,
        cursorClassName:
          "h-10 inline-block -translate-y-5 text-transparent bg-brand caret relative",
        autoStart: true,
      }}
      component={"h1"}
    />
  );
}
