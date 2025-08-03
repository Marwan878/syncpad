import { cn } from "@/lib/utils/cn";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Maximize2 } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

type ImageProps = {
  src: string;
  alt: string;
  className: string;
};

export function PageImage({ src, alt, className }: Readonly<ImageProps>) {
  const [width, setWidth] = useState(400);
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const height = width / aspectRatio;

  const [isGrabbing, setIsGrabbing] = useState(false);

  const resizeButtonRef = useRef<HTMLButtonElement>(null);

  // Did not use onMouseUp on the resize button because
  // it was not working when the user was leaving the mouse outside the button.
  // Same applies for resizing (onMouseMove).
  useEffect(() => {
    const handleMouseUp = () => {
      setIsGrabbing(false);
      document.body.style.cursor = "default";
    };

    const handleResize = (e: MouseEvent) => {
      if (!isGrabbing || !resizeButtonRef.current) return;

      const resizeButtonRect = resizeButtonRef.current.getBoundingClientRect();

      setWidth((width) => width + e.clientX - resizeButtonRect.left);
    };

    if (isGrabbing) {
      document.body.style.cursor = "grabbing";
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleResize);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleResize);
    };
  }, [isGrabbing]);

  // Get the aspect ratio of the image
  useEffect(() => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      setAspectRatio(image.width / image.height);
    };
  }, [src]);

  return (
    <div
      className={cn("relative mb-8", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <NextImage src={src} alt={alt} className="object-cover" fill />

      <button
        ref={resizeButtonRef}
        aria-label="Drag to resize"
        title="Drag to resize"
        className={cn(
          "absolute -bottom-8 -end-8 rounded-sm hover:bg-black/20 p-1 transition-colors",
          isGrabbing && "cursor-grabbing bg-black/20",
          !isGrabbing && "cursor-grab"
        )}
        onMouseDown={() => {
          setIsGrabbing(true);
        }}
        data-name="resize-button"
      >
        <Maximize2 className="rotate-z-90" aria-hidden />
      </button>
    </div>
  );
}

export default function PageImageWithNodeView({
  node,
}: Readonly<NodeViewProps>) {
  const { src, alt, class: className } = node.attrs;
  return (
    <NodeViewWrapper>
      <PageImage src={src} alt={alt} className={className} />
    </NodeViewWrapper>
  );
}
