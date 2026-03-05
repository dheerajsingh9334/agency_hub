import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, adminOnly, AuthRequest } from "../lib/auth";

const router = Router();

// Get all companies
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const companies = await prisma.clientCompany.findMany({
      orderBy: { createdAt: "desc" },
      include: { creator: { select: { name: true } } },
    });
    res.json(companies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create company (admin only)
router.post("/", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const company = await prisma.clientCompany.create({
      data: { name, createdBy: req.userId! },
    });
    res.json(company);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete company (admin only)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await prisma.clientCompany.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
