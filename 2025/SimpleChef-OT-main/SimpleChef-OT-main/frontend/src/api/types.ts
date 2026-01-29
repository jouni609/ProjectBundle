export type User = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export type Recipe = {
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  isPublic: boolean;
  imageUrl?: string;
  createdAt: string;
};

export type Favorite = {
  id: number;
  userId: number;
  recipeId: number;
  recipe: Recipe;
}
