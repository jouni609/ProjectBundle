import { apiPost } from "./httpClient";

type AuthResponse = { token: string };

export const authApi = {
  register: (email: string, password: string) =>
    apiPost<{ email: string; password: string }, AuthResponse>("/api/auth/register", { email, password }),
  login: (email: string, password: string) =>
    apiPost<{ email: string; password: string }, AuthResponse>("/api/auth/login", { email, password }),
};