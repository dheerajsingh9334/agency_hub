import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

type AppRole = "admin" | "employee" | "client";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

interface AuthContextType {
  user: UserProfile | null;
  role: AppRole | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = api.auth.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch {
      api.auth.logout();
      setUser(null);
    }
    setLoading(false);
  };

  // Listen for auth:logout events (401 from API)
  const handleAuthLogout = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    loadUser();
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [handleAuthLogout]);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const data = await api.auth.signup(email, password, name);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  };

  const signOut = async () => {
    api.auth.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    await loadUser();
  };

  const role = user?.role ?? null;
  const profile = user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
