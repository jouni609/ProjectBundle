import express from "express";
import {registeredUser, loginUser} from "../controllers/authController";

const router = express.Router();
router.use(express.json());

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Rekisteröi uusi käyttäjä
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegister'
 *     responses:
 *       201:
 *         description: Käyttäjä luotu ja token palautettu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Bad request / Email already in use / Invalid password
 */
router.post("/register", registeredUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kirjaudu sisään
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLogin'
 *     responses:
 *       200:
 *         description: Palauttaa JWT-token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

export default router;