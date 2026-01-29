import { useState } from "react";
import type { CreateRecipeDto } from "../../../api/recipes";
import { useNavigate } from "react-router-dom";
import UploadPhoto from "./UploadPhoto";

type RecipeFormProps = {
  initialData?: CreateRecipeDto;
  onSubmit: (data: CreateRecipeDto) => Promise<void> | void;
  submitLabel?: string;
};

export default function RecipeForm({
  initialData,
  onSubmit,
  submitLabel = "Save Recipe",
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients ?? [""]
  );
  const [instructions, setInstructions] = useState(
    initialData?.instructions ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let imageBase64: string | null = null;

    if (photoFile) {
      try {
        imageBase64 = await fileToBase64(photoFile);
        setImageUrl(imageBase64);
      } catch (err) {
        console.error("Error converting file to Base64:", err);
        alert("Failed to process the selected photo.");
        return;
      }
    }
    const data: CreateRecipeDto = {
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredients.map((i) => i.trim()).filter((i) => i !== ""),
      instructions: instructions.trim(),
      imageUrl: imageBase64 || imageUrl,
      isPublic: isPublic,
    };
    try {
      setSubmitting(true);
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  }
  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string); // Base64 string
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert file to Base64"));
      };

      reader.readAsDataURL(file); // reads the file and converts to Base64
    });
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
    >
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body space-y-4">
          <h2 className="card-title">{submitLabel}</h2>

          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text">Title*</span>
            </label>
            <input
              type="text"
              id="title"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ingredients*</span>
            </label>

            <div className="flex flex-col">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={ing}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    required
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={() => removeIngredient(index)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-primary mt-2 self-start"
                onClick={addIngredient}
              >
                Add Ingredient
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="instructions">
              <span className="label-text">Instructions*</span>
            </label>
            <textarea
              id="instructions"
              className="textarea textarea-bordered w-full"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>

          <UploadPhoto
            initialImage={imageUrl}
            onPhotoSelected={(file) => {
              setPhotoFile(file);
              setImageUrl("");
            }}
            onPhotoRemoved={() => {
              setPhotoFile(null);
              setImageUrl(""); // remove image entirely
            }}
          />

          <div className="form-control">
            <label className="label" htmlFor="isPublic">
              <span className="label-text">Recipe is public</span>
            </label>
            <input
              type="checkbox"
              id="isPublic"
              className="checkbox ml-5"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </div>

          <div className="flex mt-4">
            <div className="form-control">
              <button
                type="submit"
                className="btn btn-neutral w-36"
                disabled={submitting}
              >
                {submitting ? "Saving..." : submitLabel}
              </button>
            </div>
            <div className="form-control ml-10">
              <button
                type="reset"
                className="btn btn-error w-36"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
