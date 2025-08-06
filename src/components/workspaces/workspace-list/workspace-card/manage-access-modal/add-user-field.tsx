import Label from "@/components/ui/form/label";
import { AccessManagedUser } from "@/types/user";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import SearchResults from "./search-results";
import useClickOutside from "@/hooks/use-click-outside";

type AddUsersFieldProps = {
  allowedUsers: AccessManagedUser[];
  setAllowedUsers: Dispatch<SetStateAction<AccessManagedUser[]>>;
};

export default function AddUsersField({
  allowedUsers,
  setAllowedUsers,
}: Readonly<AddUsersFieldProps>) {
  const [searchResultsVisible, setSearchResultsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResultsContainerRef = useRef<HTMLDivElement>(null);
  useClickOutside(searchResultsContainerRef, () =>
    setSearchResultsVisible(false)
  );

  return (
    <fieldset className="border-b border-gray-300 pb-4">
      <legend className="font-semibold text-lg">Add users</legend>
      <div className="flex flex-col gap-y-2">
        <Label>Search for a user by name or email</Label>
        <div className="gap-x-2 relative" ref={searchResultsContainerRef}>
          <input
            type="text"
            placeholder="Search for a user"
            className="border px-3 rounded-md w-full h-11"
            onFocus={() => setSearchResultsVisible(true)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchResultsVisible && searchQuery && (
            <SearchResults
              searchQuery={searchQuery}
              allowedUsers={allowedUsers}
              setAllowedUsers={setAllowedUsers}
            />
          )}
        </div>
      </div>
    </fieldset>
  );
}
