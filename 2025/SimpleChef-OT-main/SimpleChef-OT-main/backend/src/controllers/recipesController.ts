import { Request, Response } from "express";
import prisma from "../db/prisma";

export const getAllRecipes = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

export const getAllPublicRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public recipes" });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req as any).user.id;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid input" });

  const recipe = await prisma.recipe.findFirst({
    where: { id, userId },
    include: {
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  if (!recipe) return res.status(404).json({ error: "Not found" });

  res.json(recipe);
};

export const createRecipe = async (req: Request, res: Response) => {
  const { title, ingredients, instructions, description, imageUrl, isPublic } =
    req.body;

  const userId = (req as any).user.id;

  if (!title || !instructions)
    return res.status(400).json({ error: "Invalid input" });

  if (!Array.isArray(ingredients) || ingredients.length === 0)
    return res.status(400).json({ error: "Ingredients must be an array" });

  const ingredientNames = [...new Set(
    ingredients
      .map((i: any) => (typeof i === "string" ? i : i?.name))
      .filter(Boolean)
  )];

  const nestedRecipeIngredients = ingredientNames.map((name) => ({
    ingredient: {
      connectOrCreate: {
        where: { name },
        create: { name },
      },
    },
  }));

  const created = await prisma.recipe.create({
    data: {
      userId,
      title,
      instructions,
      description,
      imageUrl,
      isPublic,
      recipeIngredients: {
        create: nestedRecipeIngredients,
      },
    },
    include: { recipeIngredients: { include: { ingredient: true } } },
  });

  res.status(201).json(created);
};

export const updateRecipe = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid input" });

  const { title, ingredients, instructions, description, imageUrl, isPublic } = req.body;
  if (!title || !ingredients || !instructions)
    return res.status(400).json({ error: "Invalid input" });

  const ingredientNames: string[] = Array.isArray(ingredients)
    ? ingredients
        .map((i: any) => (typeof i === "string" ? i : i?.name))
        .filter(Boolean)
    : [];

  const nestedRecipeIngredients = ingredientNames.map((name) => ({
    ingredient: {
      connectOrCreate: {
        where: { name },
        create: { name },
      },
    },
  }));

  try {
    const updated = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        instructions,
        description,
        imageUrl,
        isPublic,
        recipeIngredients: {
          deleteMany: {},
          create: nestedRecipeIngredients,
        },
      },
      include: { recipeIngredients: { include: { ingredient: true } } },
    });
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid input" });

  try {
    // Hae resepti, varmista että käyttäjä omistaa sen
    const recipeToDelete = await prisma.recipe.findFirst({
      where: { id, userId },
    });

    if (!recipeToDelete)
      return res.status(404).json({ error: "Not found or forbidden" });

    // Poista resepti (cascade poistaa RecipeIngredient-rivit)
    await prisma.recipe.delete({ where: { id } });

    // Poista Ingredientit, joita ei enää käytetä yhdessäkään reseptissä
    await prisma.ingredient.deleteMany({
      where: {
        recipeIngredients: { none: {} },
      },
    });

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};


