import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users } from "lucide-react";
import { TableSkeleton, EmptyState } from "@/components/PageLoader";
import { AdminSignup } from "@/components/AdminSignup";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [role, setRole] = useState("");
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      const data = await api.users.list();
      setUsers(data);
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
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      await api.users.create({
        email: form.get("email") as string,
        name: form.get("name") as string,
        password: form.get("password") as string,
        role,
      });
      toast({ title: "User created successfully" });
      setOpen(false);
      setRole("");
      loadUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (userId: string) => {
    try {
      await api.users.delete(userId);
      toast({ title: "User removed" });
      loadUsers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const roleBadge = (role: string) => {
    const variants: Record<string, string> = {
      admin: "bg-gradient-to-r from-dark-gold to-dark-rose text-white",
      employee: "bg-gradient-to-r from-dark-gold/80 to-dark-gold text-white",
      client: "bg-gradient-to-r from-dark-rose/80 to-dark-rose text-white",
    };
    return <Badge className={variants[role] ?? ""}>{role}</Badge>;
  };

  if (pageLoading) return <TableSkeleton rows={5} cols={4} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
            Users
          </h2>
        </div>
        <div className="flex gap-2">
          <AdminSignup />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0"
                  disabled={loading || !role}
                >
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users yet"
              description="Create your first user to get started."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="transition-colors">
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{roleBadge(u.role)}</TableCell>
                    <TableCell>
                      {u.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(u.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
