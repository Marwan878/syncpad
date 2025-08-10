import FloatingIndicator from "../ui/floating-indicator";

export default function StatusIndicators() {
  return (
    <div className="fixed bottom-3 right-3 flex gap-2">
      <FloatingIndicator text="Live" className="text-brand" />
      <FloatingIndicator text="Saved" className="text-accent" />
    </div>
  );
}
