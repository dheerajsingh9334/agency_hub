import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/PageLoader";
import {
  Users,
  Building2,
  FolderKanban,
  FileText,
  Wrench,
  MessageSquare,
  TrendingUp,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard
      .stats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton count={6} />;

  const cards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-dark-gold",
      bg: "bg-gradient-to-br from-dark-gold/10 to-dark-gold/20",
    },
    {
      label: "Companies",
      value: stats.companies,
      icon: Building2,
      color: "text-dark-rose",
      bg: "bg-gradient-to-br from-dark-rose/10 to-dark-rose/20",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-dark-gold",
      bg: "bg-gradient-to-br from-dark-gold/15 to-dark-rose/15",
    },
    {
      label: "Requests",
      value: stats.requests,
      icon: FileText,
      color: "text-dark-rose",
      bg: "bg-gradient-to-br from-dark-rose/10 to-dark-rose/20",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Wrench,
      color: "text-dark-gold",
      bg: "bg-gradient-to-br from-dark-gold/10 to-dark-gold/20",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-dark-rose",
      bg: "bg-gradient-to-br from-dark-rose/15 to-dark-gold/15",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card
            key={c.label}
            className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <div
                className={`rounded-lg p-2.5 ${c.bg} transition-transform duration-200 group-hover:scale-110`}
              >
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight tabular-nums">
                {c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
