import { Router } from "express";
// import {
//   generateOtpController,
//   verifyOtpController,
// } from "../controllers/auth.controller";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash-password";
import { jwtToken } from "../utils/jwt";

const authRouter = Router();

// authRouter.post("/generate", generateOtpController);
// authRouter.post("/verify", verifyOtpController);

// new routes

authRouter.post("signup/student", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "STUDENT",
        studentProfile: {
          create: { name },
        },
      },
    });

    res.json({ message: "Student created", userId: user.id });
  } catch (error) {}
});

authRouter.post("/signup/mentor", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "MENTOR",
        mentorProfile: {
          create: { name },
        },
      },
    });

    res.json({ message: "Mentor created", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student_profile: true,
        mentor_profile: true,
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwtToken.sign(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile:
          user.role === "STUDENT" ? user.student_profile : user.mentor_profile,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "err.message" });
  }
});

authRouter.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  await prisma.otp.upsert({
    where: { userId: user.id },
    update: {
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
    create: {
      code,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log("OTP:", code);

  res.json({ message: "OTP sent" });
});

authRouter.post("/verify-otp", async (req, res) => {
  const { email, code } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });
  const otp = await prisma.otp.findUnique({ where: { userId: user.id } });

  if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  await prisma.otp.delete({ where: { userId: user.id } });

  res.json({ message: "Verified successfully" });
});

export default authRouter;
