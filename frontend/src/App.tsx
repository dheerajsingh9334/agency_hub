import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Auth from "@/pages/Auth";
import AdminRegister from "@/pages/AdminRegister";
import AdminLogin from "@/pages/AdminLogin";
import AdminSignupPage from "@/pages/admin/AdminSignupPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import CompaniesPage from "@/pages/admin/CompaniesPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import ServiceRequestsPage from "@/pages/ServiceRequestsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import MessagesPage from "@/pages/MessagesPage";
import ProfilePage from "@/pages/ProfilePage";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import ClientDashboard from "@/pages/client/ClientDashboard";
import NotFound from "@/pages/NotFound";
import { FullPageSpinner } from "@/components/PageLoader";

const queryClient = new QueryClient();

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, role, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role))
    return <Navigate to="/" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function DashboardRouter() {
  const { role } = useAuth();
  if (role === "admin") return <AdminDashboard />;
  if (role === "employee") return <EmployeeDashboard />;
  if (role === "client") return <ClientDashboard />;
  return <div>Loading...</div>;
}

function AuthGuard() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/" replace />;
  return <Auth />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthGuard />} />
            <Route
              path="/admin/register"
              element={
                <PublicRoute>
                  <AdminRegister />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/signup"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminSignupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CompaniesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute allowedRoles={["admin", "client"]}>
                  <ServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service-requests"
              element={
                <ProtectedRoute allowedRoles={["admin", "client"]}>
                  <ServiceRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
