import { useNavigate } from "react-router-dom";
import RecipeForm from "./RecipeForm";
import { recipeApi } from "../../../api/recipes";
import publicBg from "../../../assets/publicBg.jpg";
import { useAuth } from "../../authorization/AuthContext";
export function CreateNewRecipePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  async function handleCreate(data: Parameters<typeof recipeApi.create>[0]) {
    if (!token) {
      alert("Please log in to create a recipe.");
      navigate("/login");
      return;
    }
    try {
      await recipeApi.create(data);
      navigate(`/recipes`);
    } catch (err) {
      console.error(err);
      alert("Failed to create recipe. Please login again.");
    }
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              Create New Recipe
            </h1>
            <p className="mb-0 text-lg">Add your recipe to the collection.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-10">
        <div className="card max-w-3xl mx-auto p-6 bg-base-100 shadow-lg shadow-black/50 border-2 border-black/50 rounded-2xl">
          <div className="card-body">
            <RecipeForm onSubmit={handleCreate} submitLabel="Create Recipe" />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateNewRecipePage;
