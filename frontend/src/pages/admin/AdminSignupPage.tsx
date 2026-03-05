import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Users } from "lucide-react";

export default function AdminSignupPage() {
  const { adminSignup } = useAuth();
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
      // Reset form
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
          Create Admin User
        </h2>
      </div>

      <div className="max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              New Admin Account
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Create a new administrator account. The new admin will have full
              access to the system.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="focus-visible:ring-dark-gold"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a strong password for the admin account
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0"
                  disabled={loading}
                >
                  {loading ? "Creating admin..." : "Create Admin Account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold/20 to-dark-rose/20">
                <ShieldCheck className="h-4 w-4 text-dark-gold" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Admin Privileges</h4>
                <p className="text-xs text-muted-foreground">
                  New admins will have access to all system features including
                  user management, company administration, service management,
                  and can create additional admin accounts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
