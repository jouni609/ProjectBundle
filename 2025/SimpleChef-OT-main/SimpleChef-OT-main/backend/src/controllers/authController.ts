import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import prisma from "../db/prisma";

const SECRET = process.env.JWT_SECRET || "secretkey";
const SALT_ROUNDS = 10;

export async function registeredUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await prisma.user.create({
            data: { email, password: hashed },
        });

        const { password: _pw, ...userSafe } = user;
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
        return res.status(201).json({ token, user: userSafe });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}

export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ error: "Server configuration error: JWT_SECRET not set" });
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}