import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/PageLoader";
import { FolderKanban, MessageSquare, TrendingUp } from "lucide-react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard
      .stats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton count={2} />;

  const cards = [
    {
      label: "Assigned Projects",
      value: stats.projects,
      icon: FolderKanban,
      gradient: "employee-gradient",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      gradient: "employee-gradient",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2 p-4 rounded-lg bg-gradient-gold-rose-light border border-gold-rose/20">
        <TrendingUp className="h-5 w-5 text-gradient-gold-rose" />
        <h2 className="text-2xl font-bold tracking-tight text-gradient-gold-rose">
          Employee Dashboard
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Card
            key={c.label}
            className="group dashboard-card transition-all duration-300 hover:shadow-gold-rose hover:-translate-y-2 bg-gradient-gold-rose-light border-gold-rose/20"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <div
                className={`rounded-lg p-2.5 ${c.gradient} transition-all duration-300 group-hover:scale-110 shadow-gold-rose`}
              >
                <c.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight tabular-nums text-gradient-gold-rose">
                {c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
