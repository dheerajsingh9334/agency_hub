import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  FolderKanban,
  FileText,
  Wrench,
  MessageSquare,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    projects: 0,
    requests: 0,
    services: 0,
    messages: 0,
  });

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(console.error);
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Companies",
      value: stats.companies,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Requests",
      value: stats.requests,
      icon: FileText,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Wrench,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold tracking-tight">
        Admin Dashboard
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card
            key={c.label}
            className="transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${c.bg}`}>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
