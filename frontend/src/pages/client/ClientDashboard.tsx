import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, FileText, MessageSquare } from "lucide-react";

export default function ClientDashboard() {
  const [stats, setStats] = useState({ projects: 0, requests: 0, messages: 0 });

  useEffect(() => {
    api.dashboard.stats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Client Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Projects
            </CardTitle>
            <FolderKanban className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.projects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Service Requests
            </CardTitle>
            <FileText className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.requests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.messages}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
