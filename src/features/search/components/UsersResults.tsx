import { memo } from "react";
import { SearchUser } from "../types/search.types";
import { UserCard } from "./UserCard";

interface UsersResultsProps {
  users: SearchUser[];
  query?: string;
  skillType?: string;
  onNavigate?: () => void;
}

const UsersResultsComponent = ({ users, query, skillType, onNavigate }: UsersResultsProps) => {
  return (
    <div className="flex flex-col gap-5 pb-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} query={query} skillType={skillType} onNavigate={onNavigate} />
      ))}
    </div>
  );
};

export const UsersResults = memo(UsersResultsComponent);
UsersResults.displayName = "UsersResults";
