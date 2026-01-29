import { Routes, Route } from "react-router-dom";
import { RecipeListPage } from "./components/private/recipe/RecipeListPage";
import { NavBar } from "./components/public/Navbar";
import CreateNewRecipePage from "./components/private/recipe/CreateNewRecipePage";
import LoginPage from "./components/authorization/LoginPage";
import RegisterPage from "./components/authorization/RegisterPage";
import Favorites from "./components/private/Favorites";
import { FrontPage } from "./components/public/FrontPage";
import RecipeDetailPage from "./components/private/recipe/RecipeDetailPage";
import AllRecipes from "./components/public/AllRecipes";
import RecipeEditPage from "./components/private/recipe/RecipeEditPage";

export default function App() {
  return (
    <main className="pt-2">
      <NavBar />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/recipes/public" element={<AllRecipes />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="recipes" element={<RecipeListPage />} />
        <Route path="recipes/new" element={<CreateNewRecipePage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route path="recipes/:id/edit" element={<RecipeEditPage />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </main>
  );
}
