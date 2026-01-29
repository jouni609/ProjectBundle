import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recipeApi } from "../../../api/recipes";
import type { CreateRecipeDto } from "../../../api/recipes";
import RecipeForm from "./RecipeForm";
import publicBg from "../../../assets/publicBg.jpg";

export default function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = Number(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<CreateRecipeDto | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    recipeApi.getById(recipeId).then((recipe : any) => {
      const dto: CreateRecipeDto = {
        title: recipe.title,
        description: recipe.description ?? "",
        ingredients: recipe.recipeIngredients.map(
          (ri: any) => ri.ingredient.name
        ),
        instructions: recipe.instructions ?? "",
        imageUrl: recipe.imageUrl ?? "",
        isPublic: recipe.isPublic ?? false,
      };

      setInitialData(dto);
    });
  }, [recipeId]);

  async function handleSubmit(data: CreateRecipeDto) {
    await recipeApi.update(recipeId, data);
    navigate(`/recipes/${recipeId}`);
  }

  if (!initialData) return <div className="h-screen flex mt-50 justify-center text-4xl">Loading...</div>;

  return (
    <>
      <div
        className="hero min-h-[18vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${publicBg})` }}
      >
        <div className="hero-overlay bg-black/50" />
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl p-6 rounded-lg bg-black/40 backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Edit Recipe</h1>
            <p className="mb-0 text-lg">Update your recipe details.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-10">
        <div className="card max-w-3xl mx-auto p-6 bg-base-100 shadow-lg shadow-black/50 border-2 border-black/50 rounded-2xl">
          <div className="card-body">
            <RecipeForm
              initialData={initialData}
              onSubmit={handleSubmit}
              submitLabel="Edit Recipe"
            />
          </div>
        </div>
      </div>
    </>
  );
}
