import { Router } from "express";
import * as recipesController from "../controllers/recipesController";
import { requireAuth } from "../middleware/authMiddleware";
const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Recipes
 *     description: Recipe CRUD endpoints
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Hae kaikki käyttäjän reseptit (uusin ensin)
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista resepteistä
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", requireAuth, recipesController.getAllRecipes);

/**
 * @swagger
 * /api/recipes/public:
 *   get:
 *     summary: Hae kaikki julkiset reseptit
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: Lista julkisista resepteistä
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/public", recipesController.getAllPublicRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Hae yksittäinen resepti id:n mukaan
 *     tags:
 *       - Recipes
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
 *         description: Yksittäinen resepti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 */
router.get("/:id", requireAuth, recipesController.getRecipeById);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Luo uusi resepti
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipe'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 */
router.post("/", requireAuth, recipesController.createRecipe);
/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Päivitä resepti
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipe'
 *     responses:
 *       200:
 *         description: Updated recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 */
router.put("/:id", requireAuth, recipesController.updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Poista resepti
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 *       400:
 *         description: Invalid input
 */
router.delete("/:id", requireAuth, recipesController.deleteRecipe);

export default router;
