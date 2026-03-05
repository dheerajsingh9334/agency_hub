import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AdminRegister() {
  const { adminRegister } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const { error } = await adminRegister(
      form.get("email") as string,
      form.get("password") as string,
      form.get("name") as string,
      form.get("adminKey") as string,
    );

    setLoading(false);
    if (error) {
      toast({
        title: "Admin registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Admin account created",
        description: "Welcome admin! You are now logged in.",
      });
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-dark-gold/10 via-background to-dark-rose/5 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg shadow-dark-gold/25">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
            Admin Registration
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create admin account for Dheeraj Software Solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Full Name</Label>
              <Input
                id="admin-name"
                name="name"
                required
                placeholder="Admin Name"
                className="focus-visible:ring-dark-gold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
                className="focus-visible:ring-dark-gold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="focus-visible:ring-dark-gold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-key">Admin Registration Key</Label>
              <Input
                id="admin-key"
                name="adminKey"
                type="password"
                required
                placeholder="Enter your admin registration key"
                className="focus-visible:ring-dark-gold"
              />
              <p className="text-xs text-muted-foreground">
                This key is provided by your system administrator
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0"
              disabled={loading}
            >
              {loading ? "Creating admin account..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
