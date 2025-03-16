"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const UserForm = () => {
  const { push } = useRouter();
  const [username, setUsername] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    push(`/${username}/overview`);
  };

  return (
    <form className="p-6 md:p-8 flex flex-col gap-6" onSubmit={onSubmit}>
      <p className="text-balance text-muted-foreground">
        Type your Last.fm username
      </p>
      <div className="grid gap-2">
        <Label htmlFor="email">Username</Label>
        <Input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Search
      </Button>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or import from
        </span>
      </div>
      <p>File</p>
    </form>
  );
};

export default UserForm;
