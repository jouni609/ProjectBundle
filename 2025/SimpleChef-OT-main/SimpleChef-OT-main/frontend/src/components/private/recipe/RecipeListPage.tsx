import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipeApi } from "../../../api/recipes.ts";
import type { Recipe } from "../../../api/types.ts";
import { RecipeCard } from "./RecipeCard.tsx";
import { useAuth } from "../../authorization/AuthContext.tsx";
import { useFavorites } from "../../../hooks/useFavorites";
import publicBg from "../../../assets/publicBg.jpg";
export function RecipeListPage() {
  const { token, loading } = useAuth(); // haetaan token ja loading state AuthContextista
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  //GET private recipes
  useEffect(() => {
    if (loading || !token) return;

    recipeApi
      .getAll()
      .then((data: any[]) => {
        const normalized = data.map((r) => ({
          ...r,
          ingredients: r.recipeIngredients.map((ri: any) => ri.ingredient.name),
        }));

        setRecipes(normalized);
      })
      .catch((err) => setError(err.message || "Failed to fetch recipes"));
  }, [token, loading]);

  if (loading) return <div className="h-screen flex mt-50 justify-center text-4xl">Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex mt-50 justify-center">
        <p className="text-4xl">
          An error has occurred getting recipes please try to{" "}
          <button
            className="font-black underline hover:cursor-pointer"
            onClick={() => nav("/login")}
          >
            Login
          </button>{" "}
          in again or refresh the page. Error reason: {error}
        </p>
      </div>
    );
  return (
    <>
      <div
        className="hero min-h-[18vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="hero-overlay bg-black/50" />
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl p-6 rounded-lg bg-black/40 backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">My Recipes</h1>
            <p className="mb-0 text-lg">Your personal recipe collection.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-10">
        {recipes.length === 0 ? (
          <div className="h-screen flex mt-50 justify-center">
            <p className="text-4xl">
              No Recipes Created. To Create a Recipe Click:{" "}
              <button
                className="font-black underline hover:cursor-pointer"
                onClick={() => nav("/recipes/new")}
              >
                New Recipe
              </button>{" "}
              and fill in the form.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showPublicity={true}
                addToFavorites={addFavorite}
                removeFromFavorites={removeFavorite}
                isFavorite={isFavorite(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
