import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, MessageSquare } from "lucide-react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0 });

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold tracking-tight">
        Employee Dashboard
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Projects
            </CardTitle>
            <div className="rounded-lg bg-blue-50 p-2">
              <FolderKanban className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {stats.projects}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <div className="rounded-lg bg-cyan-50 p-2">
              <MessageSquare className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {stats.messages}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
