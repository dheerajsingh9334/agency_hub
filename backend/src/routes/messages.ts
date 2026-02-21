import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../lib/auth";

const router = Router();

// Get contacts (all users except self)
router.get("/contacts", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const contacts = await prisma.user.findMany({
      where: { id: { not: req.userId } },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(contacts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages with a specific user
router.get("/:contactId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId, receiverId: req.params.contactId },
          { senderId: req.params.contactId, receiverId: req.userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } },
      },
    });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await prisma.message.create({
      data: { senderId: req.userId!, receiverId, content },
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } },
      },
    });
    res.json(message);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
