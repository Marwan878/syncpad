import { Dispatch, SetStateAction } from "react";
import UserCard from "./user-card";
import { AccessManagedUser } from "@/types/user";

type UserSpecificAccessFieldsProps = {
  allowedUsers: AccessManagedUser[];
  setAllowedUsers: Dispatch<SetStateAction<AccessManagedUser[]>>;
};

export default function UserSpecificAccessFields({
  allowedUsers,
  setAllowedUsers,
}: Readonly<UserSpecificAccessFieldsProps>) {
  return (
    <fieldset className="border-b border-gray-300 py-4">
      <legend className="font-semibold text-lg pt-4">
        User-specific access
      </legend>
      {allowedUsers.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          You haven&apos;t added any users to the workspace yet.
        </p>
      )}
      <div className="flex flex-col gap-y-2 overflow-y-auto max-h-32 pe-2">
        {allowedUsers.map((user) => (
          <UserCard
            key={user.id}
            userId={user.id}
            isViewer={user.isViewer}
            isEditor={user.isEditor}
            setAllowedUsers={setAllowedUsers}
            readonly={false}
          />
        ))}
      </div>
    </fieldset>
  );
}
