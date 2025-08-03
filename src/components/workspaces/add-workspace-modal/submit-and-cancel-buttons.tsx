"use client";

import { Button } from "@/components/ui";

type SubmitAndCancelButtonsProps = {
  onClose: () => void;
  isPending: boolean;
  onClick: () => void;
};

export default function SubmitAndCancelButtons({
  onClose,
  isPending,
  onClick,
}: Readonly<SubmitAndCancelButtonsProps>) {
  return (
    <>
      <Button variant="ghost" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button disabled={isPending} onClick={onClick}>
        {isPending ? "Creating..." : "Create Workspace"}
      </Button>
    </>
  );
}
