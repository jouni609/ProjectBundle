import { Request, Response } from "express";
import prisma from "../db/prisma";

export const addFavorite = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const recipeId = Number(req.body.recipeId);

  if(!recipeId) return res.status(400).json({ error: "Bad input, recipe id is missing"});
  // estä tuplat
  const exists = await prisma.favorite.findFirst({
    where: { userId, recipeId }
  });

  if (exists) {
    return res.status(400).json({ error: "Already in favorites" });
  }

  const favorite = await prisma.favorite.create({
    data: { userId, recipeId }
  });

  res.json(favorite);
};

export const removeFavorite = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const recipeId = Number(req.params.id); // Muutettu: params.id bodyn sijaan

  if (!recipeId) return res.status(400).json({ error: "Missing recipeId" });

  const favorite = await prisma.favorite.findFirst({
    where: { userId, recipeId }
  });

  if (!favorite) {
    return res.status(404).json({ error: "Favorite not found" });
  }

  await prisma.favorite.delete({ where: { id: favorite.id } });

  res.json({ success: true });
};

export const getUserFavorites = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { recipe: { include: { recipeIngredients: { include: { ingredient: true } } } } },
  });

  // muokkaa recipe.recipeIngredients -> recipe.ingredients vastaamaan frontend-mallia
  const mapped = favorites.map((f) => {
    const recipe = f.recipe as any;
    const ingredients = (recipe?.recipeIngredients || []).map((ri: any) => ri.ingredient);
    return { ...f, recipe: { ...recipe, ingredients } };
  });

  res.json(mapped);
};
