import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, adminOnly, AuthRequest } from "../lib/auth";

const router = Router();

// Get projects based on role
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    let projects;
    if (req.userRole === "admin") {
      projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { id: true, name: true } },
          employees: {
            include: { employee: { select: { id: true, name: true } } },
          },
        },
      });
    } else if (req.userRole === "employee") {
      projects = await prisma.project.findMany({
        where: { employees: { some: { employeeId: req.userId } } },
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { id: true, name: true } },
          employees: {
            include: { employee: { select: { id: true, name: true } } },
          },
        },
      });
    } else {
      // client
      projects = await prisma.project.findMany({
        where: { clientId: req.userId },
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { id: true, name: true } },
          employees: {
            include: { employee: { select: { id: true, name: true } } },
          },
        },
      });
    }
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create project (admin only)
router.post("/", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { name, description, clientId } = req.body;
    const project = await prisma.project.create({
      data: { name, description, clientId },
      include: {
        client: { select: { id: true, name: true } },
        employees: {
          include: { employee: { select: { id: true, name: true } } },
        },
      },
    });
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update project status (admin or assigned employee)
router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    // Verify access
    if (req.userRole === "employee") {
      const assignment = await prisma.projectEmployee.findFirst({
        where: { projectId: req.params.id, employeeId: req.userId },
      });
      if (!assignment)
        return res.status(403).json({ error: "Not assigned to this project" });
    } else if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Assign employee to project (admin only)
router.post(
  "/:id/assign",
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res) => {
    try {
      const { employeeId } = req.body;
      const assignment = await prisma.projectEmployee.create({
        data: { projectId: req.params.id, employeeId },
        include: { employee: { select: { id: true, name: true } } },
      });
      res.json(assignment);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Unassign employee from project (admin only)
router.delete(
  "/:id/assign/:employeeId",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      await prisma.projectEmployee.deleteMany({
        where: { projectId: req.params.id, employeeId: req.params.employeeId },
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

export default router;
