import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Building2 } from "lucide-react";

export default function AdminLogin() {
  const { user, adminLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await adminLogin(formData.email, formData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Failed to sign in as admin",
          variant: "destructive",
          duration: 4000,
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "Signed in as Admin successfully.",
          duration: 3000,
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to sign in as admin",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 rounded-lg bg-gradient-gold-rose shadow-gold-rose">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient-gold-rose">
              Dheeraj Software
            </h1>
          </div>
          <p className="text-muted-foreground">Sign in to your admin account</p>
        </div>

        <Card className="auth-card shadow-gold-rose">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-gradient-gold-rose">
              <ShieldCheck className="h-5 w-5" />
              Admin Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  autoComplete="email"
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary hover:scale-[1.02] transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an admin account?{" "}
                <Link
                  to="/admin/register"
                  className="font-medium text-gradient-gold-rose hover:underline"
                >
                  Register here
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Not an admin?{" "}
                <Link
                  to="/auth"
                  className="font-medium text-gradient-gold-rose hover:underline"
                >
                  Regular sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Dheeraj Software Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
