import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return <Button onClick={toggleSidebar}>Toggle Sidebar</Button>;
}
