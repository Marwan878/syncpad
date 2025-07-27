type ModalFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ModalFooter({
  children,
  className = "",
}: Readonly<ModalFooterProps>) {
  return (
    <div
      className={`flex items-center justify-end gap-3 px-6 py-3 pb-6 ${className}`}
    >
      {children}
    </div>
  );
}
