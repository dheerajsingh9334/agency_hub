import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { role } = useAuth();

  if (role === "admin") return <Navigate to="/" replace />;
  if (role === "employee") return <Navigate to="/" replace />;
  if (role === "client") return <Navigate to="/" replace />;

  return <Navigate to="/auth" replace />;
};

export default Index;
