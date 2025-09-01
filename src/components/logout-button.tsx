"use client";

import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  username: string;
}

const LogoutButton = ({ username }: LogoutButtonProps) => {
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex gap-2 text-sm text-muted-foreground font-normal items-center mr-2">
      <p>
        Logged in as <b>{username}</b>
      </p>
      <span>-</span>
      <Button
        className="text-foreground p-0"
        variant="link"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
