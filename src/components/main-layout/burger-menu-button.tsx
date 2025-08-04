"use client";

import { Button } from "@/components/ui";
import { Menu } from "lucide-react";

interface BurgerMenuButtonProps {
  onClick: () => void;
}

export default function BurgerMenuButton({
  onClick,
}: Readonly<BurgerMenuButtonProps>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="md:hidden p-2"
      aria-label="Open menu"
    >
      <Menu className="h-6 w-6" aria-hidden />
    </Button>
  );
}
