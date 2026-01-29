import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Recipe } from "../../../api/types";
import favoriteEmpty from "../../../assets/circle.png";
import favoriteFilled from "../../../assets/circle_filled.png";
import { cardTitle, cardText } from "../../../library/componentsPresets";
import noPhoto from "../../../assets/no-photo-3.png";

type Props = {
  recipe: Recipe;
  showPublicity: boolean;
  isFavorite?: boolean;
  addToFavorites?: (recipeId: number) => void;
  removeFromFavorites?: (recipeId: number) => void;
};

export function RecipeCard({
  recipe,
  showPublicity,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
}: Props) {
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const maxVisible = 4;

  const visibleIngredients = showAllIngredients
    ? recipe.ingredients
    : recipe.ingredients.slice(0, maxVisible);
  const nav = useNavigate();

  function ConvertTitle() {
    const title = recipe.title;
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  return (
    <div className="card card-md bg-base-100 shadow-lg shadow-black/50 border-2 border-black/50 rounded-sm w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative">
      <div className="card-body gap-4 mb-10">
        <div className="rounded-sm flex items-center justify-center max-h-88 p-1">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt="image of the food in your recipe"
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              src={noPhoto}
              alt="no photo"
              className="h-full w-full object-contain"
            />
          )}
        </div>

        <div className="border-2 border-black/30 p-4 bg-black/3 rounded-sm flex-1 mt-6">
          <h2 className="card-title text-3xl font-bold text-orange-400">{ConvertTitle()}</h2>

          <p className={cardTitle}>Ingredients</p>
          <ul className="list-disc list-inside mt-1">
            {visibleIngredients.map((i, idx) => (
              <li key={idx} className={cardText}>
                {i}
              </li>
            ))}
          </ul>

          {recipe.ingredients.length > maxVisible && (
            <button
              className="text-blue-500 mt-1 underline text-sm"
              onClick={() => setShowAllIngredients(!showAllIngredients)}
            >
              {showAllIngredients ? "Show less" : "Show more"}
            </button>
          )}
          <p className={cardTitle}>
            Instructions:{" "}
            <span className={cardText}>{recipe.instructions}</span>
          </p>

          {recipe.description && (
            <p className={cardTitle}>
              Description:{" "}
              <span className={cardText}>{recipe.description}</span>
            </p>
          )}
          {showPublicity && (
            <p className={cardTitle}>
              Publicity:{" "}
              <span className={cardText}>
                {" "}
                {recipe.isPublic ? "Public" : "Private"}
              </span>
            </p>
          )}

          <p className={cardTitle}>
            Created at:{" "}
            <span className={cardText}>
              {new Date(recipe.createdAt).toLocaleDateString()}
            </span>
          </p>

          {showPublicity && (
            <button
              className="btn btn-neutral absolute bottom-3 left-6"
              onClick={() => nav(`/recipes/${recipe.id}`)}
            >
              Open Details
            </button>
          )}

          {addToFavorites && removeFromFavorites && (
            <div className="ml-4 absolute bottom-3 right-6">
              <img
                src={isFavorite ? favoriteFilled : favoriteEmpty}
                alt={isFavorite ? "Favorite" : "Not favorite"}
                className="h-10 w-10 cursor-pointer"
                onClick={
                  isFavorite
                    ? () => removeFromFavorites(recipe.id)
                    : () => addToFavorites(recipe.id)
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
