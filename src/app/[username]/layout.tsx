import { prefetchUser } from "@/api/user/user";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: Promise<{ username: string }>;
}

export default async function Layout(props: Props) {
  const { children, params } = props;
  const queryClient = new QueryClient();
  const { username } = await params;

  await prefetchUser(username, queryClient);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <main className="p-3 space-y-6 w-full">
          <SidebarTrigger />
          <div>{children}</div>
        </main>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
