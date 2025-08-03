import handlePlural from "@/lib/utils/handlePlural";

type WarningsProps = {
  pagesCount: number;
  name: string;
};

export default function Warnings({
  pagesCount,
  name,
}: Readonly<WarningsProps>) {
  return (
    <div className="flex-1">
      <p className="text-sm text-text-primary mb-3">
        Are you sure you want to delete the workspace{" "}
        <span className="font-semibold">&quot;{name}&quot;</span>?
      </p>

      {pagesCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3 text-sm text-red-700">
          <p className="font-medium mb-1">This action cannot be undone:</p>
          <ul className="list-disc list-inside space-y-1 text-red-600">
            <li>All pages in this workspace will be deleted</li>
            <li>All collaborative content will be lost</li>
          </ul>
        </div>
      )}

      <p className="text-sm text-text-secondary">
        {pagesCount === 0
          ? "This workspace has no pages."
          : `This workspace contains ${pagesCount} ${handlePlural(
              pagesCount,
              "page",
              "pages"
            )}.`}
      </p>
    </div>
  );
}
