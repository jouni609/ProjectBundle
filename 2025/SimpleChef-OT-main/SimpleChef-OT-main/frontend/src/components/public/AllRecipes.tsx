import { useEffect, useState } from "react";
import { recipeApi } from "../../api/recipes.ts";
import type { Recipe } from "../../api/types.ts";
import { RecipeCard } from "../private/recipe/RecipeCard.tsx";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../authorization/AuthContext.tsx";
import publicBg from "../../assets/publicBg.jpg";
import { useNavigate } from "react-router-dom";

export default function AllRecipes() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
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
        setRecipes(normalized);
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

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.description?.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <div
        className="hero min-h-[18vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="hero-overlay bg-black/50" />
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl p-6 rounded-lg bg-black/60 backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              Explore Public Recipes
            </h1>
            <p className="mb-0 text-lg">
              Browse and discover recipes submitted by the community.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-4 mt-8 pb-10 bg-white/5 rounded-lg">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            <div className="form-control">
              <div className="input-group flex-nowrap">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="input input-bordered input-lg w-full border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No recipes found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((recipe) => (
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
