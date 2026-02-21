import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../lib/auth";

const router = Router();

// Get dashboard stats based on role
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole === "admin") {
      const [users, companies, projects, requests, services, messages] =
        await Promise.all([
          prisma.user.count(),
          prisma.clientCompany.count(),
          prisma.project.count(),
          prisma.serviceRequest.count(),
          prisma.service.count(),
          prisma.message.count(),
        ]);
      res.json({ users, companies, projects, requests, services, messages });
    } else if (req.userRole === "employee") {
      const [projects, messages] = await Promise.all([
        prisma.projectEmployee.count({ where: { employeeId: req.userId } }),
        prisma.message.count({
          where: { OR: [{ senderId: req.userId }, { receiverId: req.userId }] },
        }),
      ]);
      res.json({ projects, messages });
    } else {
      // client
      const [projects, requests, messages] = await Promise.all([
        prisma.project.count({ where: { clientId: req.userId } }),
        prisma.serviceRequest.count({ where: { clientId: req.userId } }),
        prisma.message.count({
          where: { OR: [{ senderId: req.userId }, { receiverId: req.userId }] },
        }),
      ]);
      res.json({ projects, requests, messages });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
