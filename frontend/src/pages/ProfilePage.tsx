import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ProfileSkeleton } from "@/components/PageLoader";

export default function ProfilePage() {
  const {
    profile,
    role,
    user,
    refreshProfile,
    loading: authLoading,
  } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.users.update(user!.id, { name });
      await refreshProfile();
      toast({ title: "Profile updated" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  if (authLoading) return <ProfileSkeleton />;

  return (
    <div className="mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-dark-gold to-dark-rose shadow-lg">
          <div className="h-5 w-5 rounded-full bg-white/20" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dark-gold to-dark-rose bg-clip-text text-transparent">
          Profile
        </h2>
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge className="capitalize bg-gradient-to-r from-dark-gold to-dark-rose text-white border-0">
                  {role}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-dark-gold to-dark-rose hover:from-dark-gold/90 hover:to-dark-rose/90 text-white border-0"
            >
              {loading ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
