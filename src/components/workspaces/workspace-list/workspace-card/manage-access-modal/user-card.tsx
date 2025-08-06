"use client";

// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// UI
import UserCardSkeleton from "@/skeletons/user-card-skeleton";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

// Types
import { AccessManagedUser, User } from "@/types/user";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

type UserCardProps = {
  userId: string;
  isViewer?: boolean;
  isEditor?: boolean;
  setAllowedUsers: Dispatch<SetStateAction<AccessManagedUser[]>>;
  readonly?: boolean;
};

export default function UserCard({
  userId,
  isViewer,
  isEditor,
  setAllowedUsers,
  readonly = true,
}: Readonly<UserCardProps>) {
  const { getToken, userId: currentUserId, isLoaded } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const token = await getToken();
      const user = await fetchWithAuth<User>(
        {
          relativeUrl: `/users/${userId}`,
          token: token ?? "",
          userId: currentUserId ?? "",
        },
        {
          method: "GET",
        }
      );

      return user;
    },
    enabled: isLoaded,
  });

  if (isLoading) {
    return <UserCardSkeleton />;
  }

  if (!user) {
    return null;
  }

  const handleViewChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Checking or unchecking "view access" is ignored if the user already has edit access
    if (isEditor) return;

    setAllowedUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        return {
          ...user,
          isViewer: e.target.checked,
        };
      })
    );
  };

  const handleEditorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAllowedUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        const newUser: AccessManagedUser = {
          ...user,
          isEditor: e.target.checked,
        };

        if (e.target.checked) {
          newUser.isViewer = true;
        }

        return newUser;
      })
    );
  };

  return (
    <div className="flex items-center gap-2 py-2">
      <Image
        src={user.avatar_url ?? "/user.png"}
        alt={user.name}
        width={38}
        height={38}
      />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>

      {readonly && (
        <Button
          variant="outline"
          size="sm"
          className="ms-auto flex items-center gap-1"
          type="button"
          onClick={() => {
            setAllowedUsers((prev) => [
              ...prev,
              { id: userId, isViewer: true, isEditor: false },
            ]);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span className="text-xs">Add User</span>
        </Button>
      )}

      {!readonly && (
        <div className="ms-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isViewer}
              disabled={isEditor}
              onChange={handleViewChange}
            />
            <p>View</p>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isEditor}
              onChange={handleEditorChange}
            />
            <p>Edit</p>
          </div>
        </div>
      )}
    </div>
  );
}
