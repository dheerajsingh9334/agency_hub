import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Building2, KeyRound } from "lucide-react";

export default function AdminRegister() {
  const { user, adminRegister } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
  });

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await adminRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminKey: formData.adminKey,
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to create admin account",
          variant: "destructive",
          duration: 4000,
        });
      } else {
        toast({
          title: "Success!",
          description: "Admin account created successfully!",
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create admin account",
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
          <p className="text-muted-foreground">
            Create your admin account with the registration key
          </p>
        </div>

        <Card className="auth-card shadow-gold-rose">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-gradient-gold-rose">
              <UserPlus className="h-5 w-5" />
              Admin Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminKey" className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-gradient-gold-rose" />
                  Admin Registration Key
                </Label>
                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Enter the admin registration key"
                  value={formData.adminKey}
                  onChange={(e) =>
                    setFormData({ ...formData, adminKey: e.target.value })
                  }
                  required
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
              </div>

              <Alert className="border-gold-rose/30 bg-gradient-gold-rose-light">
                <KeyRound className="h-4 w-4 text-gradient-gold-rose" />
                <AlertDescription className="text-sm">
                  The admin registration key is required to create an admin
                  account. Contact your system administrator if you don't have
                  it.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary hover:scale-[1.02] transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Admin Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth"
                  className="font-medium text-gradient-gold-rose hover:underline"
                >
                  Sign in here
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
