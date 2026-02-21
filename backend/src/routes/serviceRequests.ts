import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, adminOnly, AuthRequest } from "../lib/auth";

const router = Router();

// Get service requests
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const where = req.userRole === "admin" ? {} : { clientId: req.userId };
    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        client: { select: { name: true } },
      },
    });
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create service request (client)
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { serviceId } = req.body;
    const request = await prisma.serviceRequest.create({
      data: { serviceId, clientId: req.userId! },
      include: {
        service: { select: { name: true } },
        client: { select: { name: true } },
      },
    });
    res.json(request);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Approve service request (admin only) - also creates a project
router.patch(
  "/:id/approve",
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res) => {
    try {
      const request = await prisma.serviceRequest.update({
        where: { id: req.params.id },
        data: { status: "approved" },
        include: { service: true },
      });

      // Auto-create project from approved request
      const project = await prisma.project.create({
        data: {
          name: `${request.service.name} - Project`,
          description: "Auto-created from service request",
          clientId: request.clientId,
          serviceRequestId: request.id,
        },
      });

      res.json({ request, project });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Reject service request (admin only)
router.patch(
  "/:id/reject",
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res) => {
    try {
      const request = await prisma.serviceRequest.update({
        where: { id: req.params.id },
        data: { status: "rejected" },
      });
      res.json(request);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

export default router;
