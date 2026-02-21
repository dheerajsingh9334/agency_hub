const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function setToken(token: string) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

function getStoredUser(): {
  id: string;
  name: string;
  email: string;
  role: string;
} | null {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

function setStoredUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  localStorage.setItem("user", JSON.stringify(user));
}

function removeStoredUser() {
  localStorage.removeItem("user");
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    removeStoredUser();
    window.location.href = "/auth";
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      setStoredUser(data.user);
      return data;
    },
    signup: async (email: string, password: string, name: string) => {
      const data = await request("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
      setToken(data.token);
      setStoredUser(data.user);
      return data;
    },
    me: () => request("/auth/me"),
    logout: () => {
      removeToken();
      removeStoredUser();
    },
    getToken,
    getStoredUser,
  },

  // Users
  users: {
    list: () => request("/users"),
    create: (data: {
      email: string;
      password: string;
      name: string;
      role: string;
    }) => request("/users", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/users/${id}`, { method: "DELETE" }),
    update: (id: string, data: { name: string }) =>
      request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },

  // Companies
  companies: {
    list: () => request("/companies"),
    create: (data: { name: string }) =>
      request("/companies", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/companies/${id}`, { method: "DELETE" }),
  },

  // Services
  services: {
    list: () => request("/services"),
    create: (data: { name: string; description?: string }) =>
      request("/services", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/services/${id}`, { method: "DELETE" }),
  },

  // Service Requests
  serviceRequests: {
    list: () => request("/service-requests"),
    create: (data: { serviceId: string }) =>
      request("/service-requests", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    approve: (id: string) =>
      request(`/service-requests/${id}/approve`, { method: "PATCH" }),
    reject: (id: string) =>
      request(`/service-requests/${id}/reject`, { method: "PATCH" }),
  },

  // Projects
  projects: {
    list: () => request("/projects"),
    create: (data: { name: string; description?: string; clientId: string }) =>
      request("/projects", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request(`/projects/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    assign: (projectId: string, employeeId: string) =>
      request(`/projects/${projectId}/assign`, {
        method: "POST",
        body: JSON.stringify({ employeeId }),
      }),
    unassign: (projectId: string, employeeId: string) =>
      request(`/projects/${projectId}/assign/${employeeId}`, {
        method: "DELETE",
      }),
  },

  // Messages
  messages: {
    contacts: () => request("/messages/contacts"),
    list: (contactId: string) => request(`/messages/${contactId}`),
    send: (data: { receiverId: string; content: string }) =>
      request("/messages", { method: "POST", body: JSON.stringify(data) }),
  },

  // Dashboard
  dashboard: {
    stats: () => request("/dashboard"),
  },
};
