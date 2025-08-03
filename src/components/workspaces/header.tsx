import AddWorkspaceButton from "./add-workspace-button";

type HeaderProps = {
  isLoading: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
  workspacesCount: number;
};

export default function Header({
  isLoading,
  setIsAddModalOpen,
  workspacesCount,
}: Readonly<HeaderProps>) {
  return (
    <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-text-primary">
          Workspaces
        </h1>
        <p className="text-text-secondary mt-2 text-sm md:text-base text-pretty">
          Organize your collaborative documents and projects
        </p>
      </div>

      {!isLoading && workspacesCount > 0 && (
        <AddWorkspaceButton onAddWorkspace={() => setIsAddModalOpen(true)} />
      )}
    </div>
  );
}
