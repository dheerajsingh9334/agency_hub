import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserPlus, UserMinus, FolderKanban } from "lucide-react";
import { ProjectsSkeleton, EmptyState } from "@/components/PageLoader";

export default function ProjectsPage() {
  const { role } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    try {
      const proj = await api.projects.list();
      setProjects(proj);

      if (role === "admin") {
        const users = await api.users.list();
        setEmployees(users.filter((u: any) => u.role === "employee"));
        setClients(users.filter((u: any) => u.role === "client"));
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [role]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.projects.create({
        name: form.get("name") as string,
        description: form.get("description") as string,
        clientId: selectedClient,
      });
      toast({ title: "Project created" });
      setOpen(false);
      setSelectedClient("");
      load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.projects.assign(selectedProject!, selectedEmployee);
      toast({ title: "Employee assigned" });
      setAssignOpen(false);
      setSelectedEmployee("");
      load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUnassign = async (projectId: string, employeeId: string) => {
    try {
      await api.projects.unassign(projectId, employeeId);
      toast({ title: "Employee unassigned" });
      load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (projectId: string, status: string) => {
    try {
      await api.projects.updateStatus(projectId, status);
      toast({ title: "Status updated" });
      load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-warning text-warning-foreground",
      in_progress: "bg-primary text-primary-foreground",
      completed: "bg-success text-success-foreground",
    };
    return (
      <Badge className={map[status] ?? ""}>{status.replace("_", " ")}</Badge>
    );
  };

  if (pageLoading) return <ProjectsSkeleton count={3} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
            Projects
          </h2>
        </div>
        {role === "admin" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0">
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" />
                </div>
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedClient}
                >
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!selectedEmployee}
            >
              Assign
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description={
              role === "admin"
                ? "Create your first project to get started."
                : "No projects assigned to you yet."
            }
          />
        ) : (
          projects.map((p) => (
            <Card
              key={p.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {p.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Client: {p.client?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(p.status)}
                    {(role === "admin" || role === "employee") && (
                      <Select
                        value={p.status}
                        onValueChange={(v) => handleStatusUpdate(p.id, v)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">Team:</span>
                    {p.employees?.map((a: any) => (
                      <Badge
                        key={a.employee.id}
                        variant="secondary"
                        className="gap-1"
                      >
                        {a.employee.name}
                        {role === "admin" && (
                          <button
                            onClick={() => handleUnassign(p.id, a.employee.id)}
                            className="ml-1"
                          >
                            <UserMinus className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {role === "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(p.id);
                          setAssignOpen(true);
                        }}
                      >
                        <UserPlus className="mr-1 h-3 w-3" /> Assign
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
