import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

export function AdminSignup() {
  const { adminSignup } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const { error, data } = await adminSignup(
      form.get("email") as string,
      form.get("password") as string,
      form.get("name") as string,
    );

    setLoading(false);
    if (error) {
      toast({
        title: "Admin creation failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Admin user created",
        description: `Admin ${data?.user?.name} has been created successfully.`,
      });
      setOpen(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0">
          <UserPlus className="mr-2 h-4 w-4" /> Create Admin User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Admin User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-signup-name">Full Name</Label>
            <Input
              id="admin-signup-name"
              name="name"
              required
              placeholder="Admin Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-signup-email">Email</Label>
            <Input
              id="admin-signup-email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-signup-password">Password</Label>
            <Input
              id="admin-signup-password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Admin"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
