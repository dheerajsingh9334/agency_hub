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
      color: "text-primary",
    },
    {
      label: "Companies",
      value: stats.companies,
      icon: Building2,
      color: "text-success",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-warning",
    },
    {
      label: "Requests",
      value: stats.requests,
      icon: FileText,
      color: "text-destructive",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Wrench,
      color: "text-primary",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
