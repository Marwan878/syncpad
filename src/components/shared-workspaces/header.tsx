export default function Header() {
  return (
    <div className="mb-8 flex flex-col items-start justify-between space-y-4">
      <h1 className="text-xl md:text-3xl font-bold text-text-primary">
        Shared Workspaces
      </h1>
      <p className="text-text-secondary mt-2 text-sm md:text-base text-pretty">
        Workspaces that have been shared with you by other users
      </p>
    </div>
  );
}
