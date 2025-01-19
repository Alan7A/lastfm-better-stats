import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import UserForm from "./user-form";

export function Home({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
        Last.fm Better Stats
      </h1>
      <Card className="overflow-hidden bg-muite">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col">
            <UserForm />
          </div>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/login-bg.webp"
              alt="last.fm"
              className="absolute inset-0 h-full w-full object-right object-cover "
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Created with ♥ by Alan7A
      </div>
    </div>
  );
}
