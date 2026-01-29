import prisma from "../src/db/prisma";
import bcrypt from "bcrypt";

// Tämä seed tyhjentää valitut taulut ja luo 5 esimerkkireseptiä.
async function main() {
  // Remove old data (järjestyksessä FK-riippuvuudet huomioiden)
  await prisma.favorite.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.user.deleteMany();

  // Luo käyttäjät (hashataan salasanat)
  const saltRounds = 10;
  const alicePassword = await bcrypt.hash("password", saltRounds);
  const bobPassword = await bcrypt.hash("password", saltRounds);

  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
      password: alicePassword,
    },
  });

  const bob = await prisma.user.create({
    data: { email: "bob@example.com", name: "Bob", password: bobPassword },
  });

  // Ainesosat
  const ingredientNames = [
    "Eggs",
    "Flour",
    "Milk",
    "Sugar",
    "Salt",
    "Butter",
    "Tomato",
    "Basil",
    "Garlic",
    "Olive Oil",
  ];

  await prisma.ingredient.createMany({
    data: ingredientNames.map((n) => ({ name: n })),
    skipDuplicates: true,
  });
  const ingredients = await prisma.ingredient.findMany({
    where: { name: { in: ingredientNames } },
  });
  const getIng = (name: string) => ingredients.find((i) => i.name === name)!;

  const recipesData = [
    {
      title: "Perfect Scrambled Eggs",
      description: "Creamy scrambled eggs",
      instructions: "Beat eggs, add butter, cook gently.",
      ingredients: ["Eggs", "Butter", "Salt"],
      isPublic: true,
    },
    {
      title: "Simple Pancakes",
      description: "Quick pancakes for breakfast",
      instructions: "Mix flour, milk, eggs, fry on pan.",
      ingredients: ["Flour", "Milk", "Eggs", "Sugar"],
      isPublic: true,
    },
    {
      title: "Tomato Basil Bruschetta",
      description: "Fresh tomato and basil topping",
      instructions: "Toast bread, top with tomato, basil, garlic, olive oil.",
      ingredients: ["Tomato", "Basil", "Garlic", "Olive Oil", "Salt"],
      isPublic: true,
    },
    {
      title: "Garlic Butter Pasta",
      description: "Simple pasta with garlic butter",
      instructions: "Cook pasta, toss with garlic and butter.",
      ingredients: ["Garlic", "Butter", "Olive Oil", "Salt"],
      isPublic: false,
    },
    {
      title: "Classic Crepes",
      description: "Thin French crepes",
      instructions: "Whisk flour, milk, eggs; fry thin layers.",
      ingredients: ["Flour", "Milk", "Eggs", "Butter"],
      isPublic: true,
    },
  ];

  const createdRecipes: Array<any> = [];

  for (const r of recipesData) {
    const recipe = await prisma.recipe.create({
      data: {
        title: r.title,
        description: r.description,
        instructions: r.instructions,
        userId: alice.id,
        isPublic: r.isPublic,
        recipeIngredients: {
          create: r.ingredients.map((ing: string) => ({
            ingredient: { connect: { id: getIng(ing).id } },
          })),
        },
      },
      include: { recipeIngredients: true },
    });
    createdRecipes.push(recipe);
  }

  // Lisää suosikkeja (bob suosii kahta ensimmäistä reseptiä)
  if (createdRecipes.length >= 2) {
    await prisma.favorite.create({
      data: { userId: bob.id, recipeId: createdRecipes[0].id },
    });
    await prisma.favorite.create({
      data: { userId: bob.id, recipeId: createdRecipes[1].id },
    });
  }

  console.log(`Seed complete: ${createdRecipes.length} recipes created.`);
}

main()
  .then(() => {
    console.log("Seed finished");
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
