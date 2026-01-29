import { Router } from "express";
import * as favoriteController from "../controllers/favoriteController";
import { requireAuth } from "../middleware/authMiddleware";
const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Lisää resepti suosikkeihin
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Favorite added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 */
router.post("/", requireAuth, favoriteController.addFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Poista resepti suosikeista
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", requireAuth, favoriteController.removeFavorite);

/**
 * @swagger
 * /api/favorites/user:
 *   get:
 *     summary: Hae käyttäjän suosikit
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista suosikeista
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 */
router.get("/user", requireAuth, favoriteController.getUserFavorites);

export default router;