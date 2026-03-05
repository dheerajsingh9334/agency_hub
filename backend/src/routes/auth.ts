import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { generateToken, authMiddleware, AuthRequest } from "../lib/auth";

const router = Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Signup (creates client by default)
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: "client" },
    });

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user profile
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin signup (protected - only admins can create other admins)
router.post("/admin/signup", authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Check if the requesting user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });
    
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ error: "Only admins can create admin accounts" });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashed, 
        name, 
        role: "admin" 
      },
    });

    res.json({
      message: "Admin account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin registration with key (public route)
router.post("/admin/register", async (req, res) => {
  try {
    const { email, password, name, adminKey } = req.body;

    if (!email || !password || !name || !adminKey) {
      return res.status(400).json({ error: "All fields including admin key are required" });
    }

    // Check admin registration key
    const expectedKey = process.env.ADMIN_REGISTRATION_KEY || "dheeraj-admin-2026";
    if (adminKey !== expectedKey) {
      return res.status(401).json({ error: "Invalid admin registration key" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashed, 
        name, 
        role: "admin" 
      },
    });

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
