import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recipeApi } from "../../../api/recipes";
import type { Recipe } from "../../../api/types";
import { cardText, cardTitle } from "../../../library/componentsPresets";
import publicBg from "../../../assets/publicBg.jpg";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recipeId = Number(id);

  useEffect(() => {
    if (!recipeId) return;
    recipeApi
      .getById(recipeId)
      .then((data: any) => {
        const normalized = {
          ...data,
          ingredients: data.recipeIngredients.map(
            (ri: any) => ri.ingredient.name
          ),
        };
        setRecipe(normalized);
      })
      .catch((err) => setError(err.message || "Failed to fetch recipe"))
      .finally(() => setLoading(false));
  }, [recipeId]);

  if (loading)
    return (
      <div className="h-screen flex mt-50 justify-center text-4xl">
        Loading recipe...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex mt-50 justify-center">
        <p className="text-4xl">
          An error has occurred getting recipes please try to{" "}
          <button
            className="font-black underline hover:cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>{" "}
          in again or refresh the page. Error reason: {error}
        </p>
      </div>
    );
  if (!loading && !recipe)
    return (
      <div className="h-screen flex mt-50 justify-center text-4xl">
        No Recipe Found With ID {recipeId}
      </div>
    );

  if (!recipe) return;
  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this recipe?");
    if (!ok) return;

    await recipeApi.delete(recipeId);
    navigate("/recipes");
  };

  return (
    <>
      <div
        className="hero min-h-[18vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="hero-overlay bg-black/50" />
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl p-6 rounded-lg bg-black/40 backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="mb-0 text-lg">{recipe.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-10">
        <div className="card max-w-3xl mx-auto p-6 bg-base-100 shadow-lg shadow-black/50 border-2 border-black/50 rounded-2xl">
          {recipe.imageUrl && (
            <figure>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="rounded-lg border border-black/30"
              />
            </figure>
          )}

          <div className="card-body mt-4">
            <p className="text-3xl font-bold text-orange-400">{recipe.title}</p>

            <p className={cardTitle}>Description</p>
            <p className={cardText}>{recipe.description}</p>

            <h3 className={cardTitle}>Ingredients</h3>
            <p className={cardText}>{recipe.ingredients.join(", ")}</p>

            <h3 className={cardTitle}>Instructions</h3>
            <p className={cardText}>{recipe.instructions}</p>

            <div className="card-actions mt-6">
              <button
                className="btn btn-neutral w-20"
                onClick={() => navigate(`/recipes/${recipeId}/edit`)}
              >
                Edit
              </button>

              <button className="btn btn-error w-20" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
