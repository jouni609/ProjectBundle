import { useEffect, useState } from "react";
import { recipeApi } from "../../api/recipes";
import type { Recipe } from "../../api/types";
import { RecipeCard } from "../private/recipe/RecipeCard";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../authorization/AuthContext";
import publicBg from "../../assets/publicBg.jpg";
import { useNavigate } from "react-router-dom";
export function FrontPage() {
  const { token } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    recipeApi
      .getPublic()
      .then((data: any[]) => {
        const normalized = data.map((r) => ({
          ...r,
          ingredients: r.recipeIngredients
            ? r.recipeIngredients.map((ri: any) => ri.ingredient.name)
            : [],
        }));
        // Valitse kolme satunnaista reseptiä
        const shuffled = [...normalized].sort(() => Math.random() - 0.5);
        setRecipes(shuffled.slice(0, 3));
      })
      .catch((err) => setError(err.message || "Failed to fetch recipes"))
      .finally(() => setLoading(false));
  }, []);

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
        className="hero min-h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="hero-overlay bg-black/50" />
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl p-6 rounded-lg bg-black/50 backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Welcome to MasterChef Mikkeli</h1>
            <p className="mb-0 text-lg">Discover delicious recipes — here are some picks for you.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-10">
        {recipes.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No public recipes available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showPublicity={false}
                addToFavorites={token ? addFavorite : undefined}
                removeFromFavorites={token ? removeFavorite : undefined}
                isFavorite={token ? isFavorite(recipe.id) : false}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}