export default function ModalBody({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="p-6">{children}</div>;
}
