import Label from "@/components/ui/form/label";
import { Dispatch, SetStateAction } from "react";

type GlobalAccessFieldsProps = {
  anyUserCanView: boolean;
  anyUserCanEdit: boolean;
  setAnyUserCanView: Dispatch<SetStateAction<boolean>>;
  setAnyUserCanEdit: Dispatch<SetStateAction<boolean>>;
};

export default function GlobalAccessFields({
  anyUserCanView,
  anyUserCanEdit,
  setAnyUserCanView,
  setAnyUserCanEdit,
}: Readonly<GlobalAccessFieldsProps>) {
  return (
    <fieldset>
      <legend className="font-semibold text-lg mb-2 pt-4">Global Access</legend>

      <Label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={anyUserCanView}
          onChange={(e) => setAnyUserCanView(e.target.checked)}
          disabled={anyUserCanEdit}
          className="w-4 h-4"
        />
        <span className="mb-1 inline-block">
          Give access to any user to view
        </span>
      </Label>
      <Label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={anyUserCanEdit}
          onChange={(e) => {
            if (e.target.checked) {
              setAnyUserCanView(true);
            }

            setAnyUserCanEdit(e.target.checked);
          }}
          className="w-4 h-4"
        />
        <span className="mb-1 inline-block">
          Give access to any user to edit
        </span>
      </Label>
    </fieldset>
  );
}
