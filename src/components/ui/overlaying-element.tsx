import useClickOutside from "@/hooks/use-click-outside";
import useEscape from "@/hooks/use-escape";
import useFocusFirstElement from "@/hooks/use-focus-first-element";
import useFocusTrap from "@/hooks/use-focus-trap";
import useHandleOverflow from "@/hooks/use-handle-overflow";
import { ComponentProps, ReactNode, RefObject, useRef } from "react";

type OverlayingElementProps = ComponentProps<"div"> & {
  onClose: () => void;
  children: ReactNode;
  firstFocusableElementRef?: RefObject<HTMLElement | null>;
};

export default function OverlayingElement({
  onClose,
  children,
  firstFocusableElementRef,
  ...props
}: Readonly<OverlayingElementProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useHandleOverflow();
  useEscape(onClose);
  useFocusTrap(ref);
  useFocusFirstElement(firstFocusableElementRef);
  useClickOutside(ref, onClose);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" />
      <div {...props} ref={ref} aria-modal="true" role="dialog">
        {children}
      </div>
    </>
  );
}
