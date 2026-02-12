import {
  LayoutDashboard, FileText, Home, Briefcase, MessageSquare, Wrench,
  Image, Search, Inbox, Settings, LogOut, ExternalLink, Store
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";

const contentItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Pages", url: "/admin/pages", icon: FileText },
  { title: "Hero Section", url: "/admin/hero", icon: Home },
  { title: "Portfolio", url: "/admin/portfolio", icon: Briefcase },
  { title: "Services", url: "/admin/services", icon: Wrench },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Marketplace", url: "/admin/marketplace", icon: Store },
];

const toolItems = [
  { title: "Media Library", url: "/admin/media", icon: Image },
  { title: "SEO & Meta", url: "/admin/seo", icon: Search },
  { title: "Inbox", url: "/admin/leads", icon: Inbox },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/admin"} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" target="_blank" className="hover:bg-sidebar-accent/50">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>View Website</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="hover:bg-sidebar-accent/50 text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
