type PageGridProps = {
  children: React.ReactNode;
};

export default function PageGrid({ children }: Readonly<PageGridProps>) {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
      {children}
    </div>
  );
}
