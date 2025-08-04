import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function useHandleOverflow() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "unset";
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
}
