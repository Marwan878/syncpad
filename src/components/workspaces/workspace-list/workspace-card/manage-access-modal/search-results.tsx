import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { AccessManagedUser, User } from "@/types/user";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import UserCard from "./user-card";
import { Pencil } from "lucide-react";

type SearchResultsProps = {
  searchQuery: string;
  allowedUsers: AccessManagedUser[];
  setAllowedUsers: Dispatch<SetStateAction<AccessManagedUser[]>>;
};

export default function SearchResults({
  searchQuery,
  allowedUsers,
  setAllowedUsers,
}: Readonly<SearchResultsProps>) {
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { data: users, isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      const token = await getToken();
      const users = await fetchWithAuth<User[]>({
        relativeUrl: `/users?query=${searchQuery}`,
        token,
        userId,
      });

      return users;
    },
    initialData: [],
    enabled: isAuthLoaded,
  });

  const isLoading = isUsersLoading || !isAuthLoaded;

  // Do not show in the search results the current user (who's searching) or someone who is already in the user-specific access menu
  const filteredUsers = users.filter(
    (user) =>
      user.id !== userId &&
      !allowedUsers.some((allowedUser) => allowedUser.id === user.id)
  );

  return (
    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md p-2 shadow-md space-y-2">
      {isLoading && (
        <li className="flex items-center justify-center">
          <Pencil className="animate-spin w-6 h-6 text-brand" />
        </li>
      )}
      {!isLoading && filteredUsers.length === 0 && (
        <p className="text-center">No users found</p>
      )}

      {filteredUsers.map((user) => (
        <li key={user.id}>
          <UserCard
            userId={user.id}
            setAllowedUsers={setAllowedUsers}
            readonly={true}
          />
        </li>
      ))}
    </ul>
  );
}
