import type { Favorite } from "./types";
import { apiPost, apiDelete, apiGet } from "./httpClient";

export type FavoriteRecipeDto = Omit<Favorite, "id" | "userId">;
export const favoriteApi = {
  addFavorite: (id: number): Promise<Favorite> => apiPost("/api/favorites", {recipeId: id}),
  removeFavorite: (recipeId: number) =>
    apiDelete<{ success: boolean }>(`/api/favorites/${recipeId}`), // Muutettu: recipeId URL:ssa
  getUserFavorites: () => apiGet<Favorite[]>(`/api/favorites/user`),
};