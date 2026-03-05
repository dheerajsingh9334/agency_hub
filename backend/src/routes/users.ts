import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { authMiddleware, adminOnly, AuthRequest } from "../lib/auth";

const router = Router();

// Get all users (admin) or filtered list
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create user (admin only)
router.post("/", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (admin only)
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  async (req: AuthRequest, res) => {
    try {
      if (req.params.id === req.userId) {
        return res.status(400).json({ error: "Cannot delete yourself" });
      }
      await prisma.user.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Update profile
router.patch("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.params.id !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
