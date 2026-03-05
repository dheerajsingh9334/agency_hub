import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Building2,
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  Wrench,
  FileText,
  Menu,
  X,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navByRole = {
  admin: [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/companies", icon: Building2, label: "Companies" },
    { to: "/services", icon: Wrench, label: "Services" },
    { to: "/service-requests", icon: FileText, label: "Requests" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/admin/signup", icon: UserPlus, label: "Add Admin" },
    { to: "/profile", icon: Settings, label: "Profile" },
  ],
  employee: [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: FolderKanban, label: "My Projects" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/profile", icon: Settings, label: "Profile" },
  ],
  client: [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: FolderKanban, label: "My Projects" },
    { to: "/services", icon: Wrench, label: "Services" },
    { to: "/service-requests", icon: FileText, label: "My Requests" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/profile", icon: Settings, label: "Profile" },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = role ? navByRole[role] : [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4 bg-gradient-gold-rose-light">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold-rose">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight sidebar-brand">
            Dheeraj Software
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto md:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-all hover:bg-gradient-gold-rose-light hover:text-sidebar-foreground border border-transparent hover:border-gold-rose/20"
              activeClassName="bg-gradient-gold-rose text-white font-medium shadow-gold-rose"
              onClick={() => setSidebarOpen(false)}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3 bg-gradient-gold-rose-light">
          <div className="mb-2 flex items-center gap-2 px-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-gold-rose text-xs font-bold text-white shadow-gold-rose">
              {profile?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-sidebar-foreground">
                {profile?.name}
              </div>
              <div className="text-[10px] capitalize text-gradient-gold-rose font-semibold">
                {role}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover-gradient-gold-rose border border-transparent hover:border-gold-rose/30"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-gradient-gold-rose-light backdrop-blur-sm px-4 md:px-6 sticky top-0 z-20 border-gold-rose/20">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover-gradient-gold-rose"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-tight text-gradient-gold-rose">
            Dheeraj Software Solutions
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30 scroll-smooth">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
