import { useEffect, useState } from "react";
import { favoriteApi } from "../api/favorite";
import type { Favorite } from "../api/types";
import { useAuth } from "../components/authorization/AuthContext";

export function useFavorites() {
  const { token, loading } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    if (loading || !token) return;

    favoriteApi
      .getUserFavorites()
      .then((data) => setFavorites(data))
      .finally(() => setFavLoading(false));
  }, [token, loading]);

  async function addFavorite(recipeId: number) {
    if (loading || !token) return;
    const result = await favoriteApi.addFavorite(recipeId);
    setFavorites((prev) => [...prev, result]);
  }

  async function removeFavorite(recipeId: number) {
    if (loading || !token) return;
    const target = favorites.find((f) => f.recipeId === recipeId);
    if (!target) return;
    const result = await favoriteApi.removeFavorite(recipeId);
    if (result.success) {
      setFavorites((prev) => prev.filter((f) => f.recipeId !== recipeId));
    }
  }

  function isFavorite(recipeId: number) {
    return favorites.some((f) => f.recipeId === recipeId);
  }

  return {
    favorites,
    favLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
