export default function ErrorMessage({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-sm text-red-600 mt-1">{children}</p>;
}
