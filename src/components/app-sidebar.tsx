"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  ArrowLeft,
  BarChart2,
  ChartSpline,
  Disc,
  Music,
  Users
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const getItems = (username: string) => [
  { title: "Home", href: "/", icon: ArrowLeft },
  { title: "Overview", href: `/${username}/overview`, icon: ChartSpline },
  { title: "Artists", href: `/${username}/artists`, icon: Users },
  { title: "Albums", href: `/${username}/albums`, icon: Disc },
  { title: "Tracks", href: `/${username}/tracks`, icon: Music },
  { title: "Scrobbles", href: `/${username}/scrobbles`, icon: BarChart2 }
];
const AppSidebar = () => {
  const pathname = usePathname();
  const { username } = useParams<{ username: string }>();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-3 pb-0">
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu className="space-y-2">
          {getItems(username).map((item) => {
            const { href, title } = item;
            const isActive = pathname.endsWith(href);
            return (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={title}>
                  <Link href={href} className="py-6">
                    <div className="flex gap-6 text-lg items-center [collapsible=icon]:pl-6">
                      <item.icon className="h-5 w-5" />
                      <span>{title}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
};

export default AppSidebar;
