import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Building2 } from "lucide-react";
import { TableSkeleton, EmptyState } from "@/components/PageLoader";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    try {
      const data = await api.companies.list();
      setCompanies(data);
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
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.companies.create({ name: form.get("name") as string });
      toast({ title: "Company created" });
      setOpen(false);
      load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.companies.delete(id);
      toast({ title: "Company deleted" });
      load();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (pageLoading) return <TableSkeleton rows={4} cols={3} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
            Client Companies
          </h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0">
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input name="name" required />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0"
              >
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {companies.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No companies yet"
              description="Add your first client company."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((c) => (
                  <TableRow key={c.id} className="transition-colors">
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
