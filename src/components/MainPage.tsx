import { useState, useEffect, useRef } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import AddRecipe from './AddRecipe';
import domtoimage from 'dom-to-image-more';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  ingredients: string[];
  instructions: string;
}

export default function MainPage() {
  const [selectedRecipe, setSelectedRecipe] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
   const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const stored = localStorage.getItem('recipes');
    return stored ? JSON.parse(stored) :
      [
        {
          id: 1,
          title: "Spaghetti Carbonara",
          image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
          ingredients: [
            "400g spaghetti",
            "200g pancetta or bacon",
            "4 large eggs",
            "100g Parmesan cheese",
            "Black pepper",
            "Salt"
          ],
          instructions: "Cook spaghetti according to package directions. Meanwhile, fry pancetta until crispy. Beat eggs with grated Parmesan and black pepper. Drain pasta, reserving some pasta water. Remove pan from heat, add pasta to pancetta, then quickly stir in egg mixture. Add pasta water to create a creamy sauce. Serve immediately with extra Parmesan."
        }

      ]
  });


  const onAddRecipe = (newRecipe: Recipe) => {
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
  }

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const currentRecipe = recipes.find(r => r.id === selectedRecipe) || recipes[0];

  const recipeRef = useRef<HTMLDivElement>(null);

  const handleRecipeClick = (id: number) => {
    setSelectedRecipe(id);
    setShowDetails(true);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadAsImage = async () => {
    if (!recipeRef.current) return;

    // Ajouter une classe temporaire pour capture
    recipeRef.current.classList.add('no-border-shadow');

    try {
      const dataUrl = await domtoimage.toPng(recipeRef.current);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${currentRecipe.title}.png`;
      link.click();
    } catch (error) {
      console.error(error);
    } finally {
      recipeRef.current.classList.remove('no-border-shadow');
    }
  };

  // const downloadAsPDF = async () => {
  //   if (!recipeRef.current) return;

  //   try {
  //     const dataUrl = await domtoimage.toPng(recipeRef.current);
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const img = new Image();
  //     img.src = dataUrl;
  //     img.onload = () => {
  //       const pdfHeight = (img.height * pdfWidth) / img.width;
  //       pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
  //       pdf.save(`${currentRecipe.title}.pdf`);
  //     };
  //   } catch (error) {
  //     console.error("Erreur PDF:", error);
  //   }
  // };


  return (
    <div className="flex flex-col lg:flex-row h-screen bg-orange-50">
      <div className={`${showDetails ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-orange-300 p-4 md:p-6 overflow-y-auto`}>
        <div className="lg:hidden mb-4">
          <h1 className="text-3xl font-bold text-orange-500 text-center">Jolibeob</h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher les recettes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-400 bg-yellow-50 text-sm md:text-base"
          />
        </div>


        <button onClick={() => setAddModal(true)}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg transition-all text-sm mb-6">
          <Plus size={20} />
          Ajouter
        </button>

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-4">Touts les recettes</h2>
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${selectedRecipeId === recipe.id ? 'bg-orange-100 shadow-md' : 'hover:bg-yellow-50'
                }`}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-orange-300"
              />
              <h3 className="text-base md:text-lg font-semibold text-gray-800">{recipe.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className={`${showDetails ? 'flex' : 'hidden lg:flex'} flex-col w-full lg:w-2/3 p-4 md:p-8 overflow-y-auto`}>
        <button
          onClick={() => setShowDetails(false)}
          className="lg:hidden flex items-center gap-2 text-orange-600 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <h1 className="hidden lg:block text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500">Jolibeob</h1>
          <button
            onClick={() => setAddModal(true)}
            className="hidden lg:flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold shadow-lg transition-all text-sm md:text-base"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>

        {/* Recipe Details */}
        <div ref={recipeRef} className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 border-4 border-yellow-200">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4 md:mb-6">{currentRecipe.title}</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6 md:mb-8">

            <div className="w-full md:w-1/2">
              <h3 className="text-xl md:text-2xl font-bold text-green-600 mb-3 md:mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {currentRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    <span className="text-sm md:text-base text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-1/2">
              <img
                src={currentRecipe.image}
                alt={currentRecipe.title}
                className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg border-4 border-orange-200"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-green-600 mb-3 md:mb-4">Préparation</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed bg-yellow-50 p-4 md:p-6 rounded-xl border-2 border-orange-200">
              {currentRecipe.instructions}
            </p>
          </div>


        </div>
        <div className="flex gap-4 mt-6 justify-end">
          <button onClick={downloadAsImage} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Télécharger la recette</button>
          {/* <button onClick={downloadAsPDF} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Télécharger en PDF</button> */}
        </div>
      </div>
      <AddRecipe isOpen={addModal} onClose={() => setAddModal(false)} onAddRecipe={onAddRecipe} />
    </div>
  );

}

