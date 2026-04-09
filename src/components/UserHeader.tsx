import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export const UserHeader = () => {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const meta = user.user_metadata;
  const name = meta?.full_name || meta?.name || user.email || "사용자";
  const avatar = meta?.avatar_url || meta?.picture;

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <button
        onClick={signOut}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-3.5 w-3.5" />
        로그아웃
      </button>
    </div>
  );
};
