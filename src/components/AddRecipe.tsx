
import React, { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Recipe } from './MainPage';

interface RecipeData {
  title: string;
  image: File | null;
  ingredients: string;
  instructions: string;
}


interface AddRecipeProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (newRecipe: Recipe) => void;
}
export default function AddRecipe({ isOpen, onClose , onAddRecipe}:  AddRecipeProps) {
  const [imagePreview, setImagePreview] = useState("");
  const [recipeData, setRecipeData] = useState<RecipeData>({
    title: '',
    image: null,
    ingredients: '',
    instructions: '',
  })

  if (!isOpen) return null;

 

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecipeData(prevData => ({
        ...prevData,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const RecipeChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const Addsubmit = (e: FormEvent) => {
  e.preventDefault();

  const newRecipe: Recipe = {
    id: Date.now(),
    title: recipeData.title,
    image: imagePreview,
    ingredients: recipeData.ingredients.split("\n"),
    instructions: recipeData.instructions,
  };

  onAddRecipe(newRecipe);
  onClose();
};

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-4 border-orange-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-600">Ajouter une recette</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de la recette</label>
            <input
              type="text"
              name="title"
              value={recipeData.title}
              onChange={RecipeChange}
              className="w-full border-2 border-orange-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Ex: Tarte aux pommes"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image de la recette</label>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChange}
                className="w-full border-2 border-orange-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg border-4 border-orange-200"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ingrédients</label>
            <textarea name="ingredients" value={recipeData.ingredients} onChange={RecipeChange}
              className="w-full border-2 border-orange-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              rows={5}
              placeholder="Entrez chaque ingrédient sur une nouvelle ligne"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions de préparation</label>
            <textarea name="instructions" value={recipeData.instructions} onChange={RecipeChange}
              className="w-full border-2 border-orange-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              rows={6}
              placeholder="Décrivez les étapes de préparation..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={Addsubmit}
              className="flex-1 bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
            >
              Ajouter la recette
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-full font-semibold transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}