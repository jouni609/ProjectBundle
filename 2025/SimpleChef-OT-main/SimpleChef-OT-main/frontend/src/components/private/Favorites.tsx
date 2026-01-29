import { useFavorites } from "../../hooks/useFavorites";
import { RecipeCard } from "./recipe/RecipeCard";
import publicBg from "../../assets/publicBg.jpg";
export default function FavoritesPage() {
  const { favorites, favLoading, addFavorite, removeFavorite, isFavorite } = useFavorites();

  if (favLoading) return <div className="h-screen flex mt-50 justify-center text-4xl">Loading favorites...</div>;

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center mt-8">
        No favorites yet. You can add them from the <strong>All Recipes</strong> page or from <strong>My Recipes</strong> page
      </div>
    );
  }

  return (
    <>
      <div
        className="hero min-h-[18vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="hero-overlay bg-black/50" />
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl p-6 rounded-lg bg-black/40 backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Favorite Recipes</h1>
            <p className="mb-0 text-lg">Recipes you've marked as favorites.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav: any) => {
            const normalizedRecipe = {
              ...fav.recipe,
              ingredients: fav.recipe.recipeIngredients
                ? fav.recipe.recipeIngredients.map((ri: any) => ri.ingredient.name)
                : [],
            };

            return (
              <RecipeCard
                key={fav.id}
                recipe={normalizedRecipe}
                showPublicity={false}
                addToFavorites={addFavorite}
                removeFromFavorites={removeFavorite}
                isFavorite={isFavorite(fav.recipe.id)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
