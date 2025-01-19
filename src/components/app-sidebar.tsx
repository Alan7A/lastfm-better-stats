"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
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
  { title: "Overview", href: `${"/overview"}"/overview"`, icon: ChartSpline },
  { title: "Artists", href: `${"/artists"}"/artists"`, icon: Users },
  { title: "Albums", href: `${"/albums"}"/albums"`, icon: Disc },
  { title: "Tracks", href: `${"/tracks"}"/tracks"`, icon: Music },
  { title: "Scrobbles", href: `${"/scrobbles"}"/scrobbles"`, icon: BarChart2 }
];
const AppSidebar = () => {
  const pathname = usePathname();
  const { username } = useParams<{ username: string }>();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader />
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
