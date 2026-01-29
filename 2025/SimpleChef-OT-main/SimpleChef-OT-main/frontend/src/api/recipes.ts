//Tämä on keskitetty API-kerros. Piilottaa suoran fetch kutsun React komponenteilta. Sis. CREATE, READ, UPDATE, DELETE.

import type { Recipe } from "./types";
import { apiPost, apiDelete, apiGet, apiPut } from "./httpClient";

export type CreateRecipeDto = Omit<Recipe, "id" | "createdAt">; // Omit on Reactin tyyppityökalu, joka luo uuden tyypin (CreateRecipeDto) ilman tiettyjä kenttiä. Tässä poistetaan id ja createdAt, koska backend generoi ne.
export type UpdateRecipeDto = Partial<CreateRecipeDto>; // Partial tekee T-tyypin kentistä valinnaisia. Tässä UpsateRecipeDto on createRecipeDto, mutta ei sisällä kaikkia kenttiä, koska ei päivityksessä välttämättä muuteta kaikkia kenttiä.

export const recipeApi = {
  getAll: () => apiGet<Recipe[]>("/api/recipes"), // hakee kaikki reseptit backendistä ja palauttaa taulukon Recipe[]
  getPublic: () => apiGet<Recipe[]>("/api/recipes/public"), //Hakee kaikki julkiset reseptit backendistä ja palauttaa taulukon Recipe[]
  getById: (id: number) => apiGet<Recipe>(`/api/recipes/${id}`), //Hakee yhden reseptin id:llä ja palauttaa Recipe objektin
  create: (data: CreateRecipeDto) => apiPost<CreateRecipeDto, Recipe>("/api/recipes", data), //Luo uuden recipen backendissä. Lähetetty data on CreateRecipeDto. Lupaa palauttaa Recipe objektin.
  update: (id: number, data: UpdateRecipeDto) => apiPut<UpdateRecipeDto, Recipe>(`/api/recipes/${id}`, data), //Päivittää olemassa olevan reseptin id:n perusteella. Palauttaa lupauksen, joka ei sisällä dataa (void)
  delete: (id: number) => apiDelete<void>(`/api/recipes/${id}`), //Poistaa recipen id:n perusteella, palauttaa promise void.
};

