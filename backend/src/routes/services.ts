import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, adminOnly, AuthRequest } from "../lib/auth";

const router = Router();

// Get all services
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(services);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create service (admin only)
router.post("/", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { name, description } = req.body;
    const service = await prisma.service.create({
      data: { name, description },
    });
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete service (admin only)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
