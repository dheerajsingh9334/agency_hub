import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  UserPlus,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AdminSignupPage() {
  const { adminSignup } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await adminSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Creation Failed",
          description: error.message || "Failed to create admin account",
          variant: "destructive",
          duration: 4000,
        });
      } else {
        toast({
          title: "Success!",
          description: "New admin account created successfully.",
          duration: 3000,
        });
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2 p-4 rounded-lg bg-gradient-gold-rose-light border border-gold-rose/20">
        <Shield className="h-5 w-5 text-gradient-gold-rose" />
        <h2 className="text-2xl font-bold tracking-tight text-gradient-gold-rose">
          Create New Admin
        </h2>
      </div>

      <div className="max-w-2xl">
        <Card className="dashboard-card bg-gradient-gold-rose-light border-gold-rose/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gradient-gold-rose">
              <UserPlus className="h-5 w-5" />
              Admin Account Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-gold-rose/30 bg-gradient-gold-rose-light">
              <AlertCircle className="h-4 w-4 text-gradient-gold-rose" />
              <AlertDescription>
                <strong>Admin Privileges Include:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Complete user management (create, edit, delete users)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Company and service management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Project creation and employee assignment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    System-wide analytics and reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Create additional admin accounts
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                  className="focus:border-gold-rose/50 focus:ring-gold-rose/20"
                />
                <p className="text-xs text-muted-foreground">
                  Password should be at least 6 characters long and include a
                  mix of letters and numbers.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn-primary hover:scale-[1.02] transition-transform"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Admin Account
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({ name: "", email: "", password: "" })
                  }
                  className="border-gold-rose/30 text-gradient-gold-rose hover:bg-gradient-gold-rose-light"
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Alert className="mt-6 border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Security Note:</strong> New admin accounts will have
            immediate access to all system functions. Ensure you trust the
            individual before creating their admin account.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
