import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MainSidebar from '../../components/ui/MainSidebar';
import RecipeCategoryFilter from './components/RecipeCategoryFilter';
import RecipeList from './components/RecipeList';
import RecipePreview from './components/RecipePreview';
import RecipeEditor from './components/RecipeEditor';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockCategories = [
    { id: 'all', name: 'All Recipes', icon: 'ChefHat' },
    { id: 'appetizers', name: 'Appetizers', icon: 'Utensils' },
    { id: 'main-course', name: 'Main Course', icon: 'Beef' },
    { id: 'desserts', name: 'Desserts', icon: 'Cake' },
    { id: 'beverages', name: 'Beverages', icon: 'Coffee' },
    { id: 'snacks', name: 'Snacks', icon: 'Cookie' },
    { id: 'soups', name: 'Soups', icon: 'Bowl' },
    { id: 'salads', name: 'Salads', icon: 'Salad' }
  ];

  const mockRecipes = [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Creamy and rich North Indian curry with tender chicken pieces in a tomato-based sauce with aromatic spices.",
      category: "main-course",
      difficulty: "Medium",
      preparationTime: 45,
      servings: 4,
      rating: 4.8,
      estimatedCost: 280,
      status: "active",
      isPopular: true,
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      createdBy: "Chef Rajesh Kumar",
      lastUpdated: "2025-01-10T10:30:00Z",
      ingredients: [
        { id: 1, name: "Chicken", quantity: 500, unit: "grams", cost: 150, stock: 2000 },
        { id: 2, name: "Tomatoes", quantity: 3, unit: "pieces", cost: 30, stock: 50 },
        { id: 3, name: "Heavy Cream", quantity: 200, unit: "ml", cost: 40, stock: 1000 },
        { id: 4, name: "Butter", quantity: 50, unit: "grams", cost: 25, stock: 500 },
        { id: 5, name: "Garam Masala", quantity: 2, unit: "tsp", cost: 10, stock: 200 }
      ],
      instructions: [
        { id: 1, instruction: "Marinate chicken pieces with yogurt, ginger-garlic paste, and spices for 30 minutes.", timer: 30, temperature: null },
        { id: 2, instruction: "Heat butter in a pan and cook marinated chicken until golden brown.", timer: 8, temperature: 180 },
        { id: 3, instruction: "Prepare tomato puree by blending fresh tomatoes with onions and spices.", timer: 5, temperature: null },
        { id: 4, instruction: "Add tomato puree to the pan and cook until oil separates.", timer: 10, temperature: 160 },
        { id: 5, instruction: "Add cream and simmer for 5 minutes. Garnish with fresh coriander.", timer: 5, temperature: 140 }
      ],
      nutrition: {
        calories: "420",
        protein: "35g",
        carbs: "12g",
        fat: "28g"
      },
      tags: ["indian", "curry", "chicken", "creamy"]
    },
    {
      id: 2,
      name: "Masala Dosa",
      description: "Crispy South Indian crepe made from fermented rice and lentil batter, served with spiced potato filling.",
      category: "main-course",
      difficulty: "Hard",
      preparationTime: 120,
      servings: 6,
      rating: 4.6,
      estimatedCost: 120,
      status: "active",
      isPopular: true,
      image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
      createdBy: "Chef Priya Nair",
      lastUpdated: "2025-01-08T14:20:00Z",
      ingredients: [
        { id: 1, name: "Rice", quantity: 300, unit: "grams", cost: 45, stock: 5000 },
        { id: 2, name: "Urad Dal", quantity: 100, unit: "grams", cost: 35, stock: 1000 },
        { id: 3, name: "Potatoes", quantity: 4, unit: "pieces", cost: 20, stock: 100 },
        { id: 4, name: "Mustard Seeds", quantity: 1, unit: "tsp", cost: 5, stock: 200 },
        { id: 5, name: "Curry Leaves", quantity: 10, unit: "pieces", cost: 5, stock: 500 }
      ],
      instructions: [
        { id: 1, instruction: "Soak rice and urad dal separately for 4-6 hours.", timer: 360, temperature: null },
        { id: 2, instruction: "Grind rice and dal separately to make smooth batter. Mix and ferment overnight.", timer: 480, temperature: null },
        { id: 3, instruction: "Prepare potato masala by cooking boiled potatoes with spices.", timer: 15, temperature: 160 },
        { id: 4, instruction: "Heat dosa pan and spread batter thinly to make crispy dosa.", timer: 3, temperature: 180 },
        { id: 5, instruction: "Add potato filling and fold the dosa. Serve hot with chutney and sambar.", timer: 2, temperature: null }
      ],
      nutrition: {
        calories: "280",
        protein: "8g",
        carbs: "55g",
        fat: "4g"
      },
      tags: ["south-indian", "vegetarian", "fermented", "crispy"]
    },
    {
      id: 3,
      name: "Gulab Jamun",
      description: "Soft and spongy milk-based dumplings soaked in aromatic sugar syrup, a classic Indian dessert.",
      category: "desserts",
      difficulty: "Easy",
      preparationTime: 60,
      servings: 8,
      rating: 4.9,
      estimatedCost: 180,
      status: "active",
      isPopular: false,
      image: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg",
      createdBy: "Chef Amit Sharma",
      lastUpdated: "2025-01-12T16:45:00Z",
      ingredients: [
        { id: 1, name: "Milk Powder", quantity: 200, unit: "grams", cost: 80, stock: 1000 },
        { id: 2, name: "All Purpose Flour", quantity: 50, unit: "grams", cost: 10, stock: 2000 },
        { id: 3, name: "Sugar", quantity: 300, unit: "grams", cost: 30, stock: 5000 },
        { id: 4, name: "Cardamom", quantity: 4, unit: "pieces", cost: 15, stock: 100 },
        { id: 5, name: "Ghee", quantity: 100, unit: "ml", cost: 45, stock: 500 }
      ],
      instructions: [
        { id: 1, instruction: "Mix milk powder, flour, and a pinch of baking soda. Add milk gradually to form soft dough.", timer: 10, temperature: null },
        { id: 2, instruction: "Make small balls from the dough and deep fry in ghee until golden brown.", timer: 15, temperature: 160 },
        { id: 3, instruction: "Prepare sugar syrup by boiling sugar with water and cardamom until sticky.", timer: 20, temperature: 110 },
        { id: 4, instruction: "Add fried balls to warm syrup and let them soak for 2 hours.", timer: 120, temperature: null },
        { id: 5, instruction: "Serve warm or at room temperature, garnished with chopped pistachios.", timer: null, temperature: null }
      ],
      nutrition: {
        calories: "320",
        protein: "6g",
        carbs: "45g",
        fat: "14g"
      },
      tags: ["dessert", "sweet", "indian", "festival"]
    },
    {
      id: 4,
      name: "Samosa",
      description: "Crispy triangular pastry filled with spiced potatoes and peas, perfect as an appetizer or snack.",
      category: "appetizers",
      difficulty: "Medium",
      preparationTime: 90,
      servings: 12,
      rating: 4.7,
      estimatedCost: 150,
      status: "active",
      isPopular: true,
      image: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg",
      createdBy: "Chef Sunita Devi",
      lastUpdated: "2025-01-09T11:15:00Z",
      ingredients: [
        { id: 1, name: "All Purpose Flour", quantity: 250, unit: "grams", cost: 25, stock: 2000 },
        { id: 2, name: "Potatoes", quantity: 4, unit: "pieces", cost: 20, stock: 100 },
        { id: 3, name: "Green Peas", quantity: 100, unit: "grams", cost: 15, stock: 500 },
        { id: 4, name: "Cumin Seeds", quantity: 1, unit: "tsp", cost: 5, stock: 200 },
        { id: 5, name: "Oil", quantity: 500, unit: "ml", cost: 85, stock: 2000 }
      ],
      instructions: [
        { id: 1, instruction: "Make dough with flour, oil, and water. Rest for 30 minutes.", timer: 30, temperature: null },
        { id: 2, instruction: "Prepare filling by cooking boiled potatoes with peas and spices.", timer: 15, temperature: 160 },
        { id: 3, instruction: "Roll dough into circles, cut in half, and form cones.", timer: 20, temperature: null },
        { id: 4, instruction: "Fill cones with potato mixture and seal edges with water.", timer: 15, temperature: null },
        { id: 5, instruction: "Deep fry samosas until golden and crispy. Serve hot with chutney.", timer: 10, temperature: 180 }
      ],
      nutrition: {
        calories: "180",
        protein: "4g",
        carbs: "22g",
        fat: "8g"
      },
      tags: ["snack", "fried", "vegetarian", "crispy"]
    },
    {
      id: 5,
      name: "Masala Chai",
      description: "Aromatic spiced tea brewed with milk, perfect for any time of the day with traditional Indian spices.",
      category: "beverages",
      difficulty: "Easy",
      preparationTime: 15,
      servings: 2,
      rating: 4.5,
      estimatedCost: 25,
      status: "active",
      isPopular: false,
      image: "https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg",
      createdBy: "Chef Ravi Patel",
      lastUpdated: "2025-01-11T09:30:00Z",
      ingredients: [
        { id: 1, name: "Tea Leaves", quantity: 2, unit: "tsp", cost: 5, stock: 500 },
        { id: 2, name: "Milk", quantity: 200, unit: "ml", cost: 10, stock: 1000 },
        { id: 3, name: "Sugar", quantity: 2, unit: "tsp", cost: 2, stock: 5000 },
        { id: 4, name: "Ginger", quantity: 1, unit: "inch", cost: 3, stock: 200 },
        { id: 5, name: "Cardamom", quantity: 2, unit: "pieces", cost: 5, stock: 100 }
      ],
      instructions: [
        { id: 1, instruction: "Boil water with ginger, cardamom, and other spices for 2 minutes.", timer: 2, temperature: 100 },
        { id: 2, instruction: "Add tea leaves and boil for another 2 minutes until color changes.", timer: 2, temperature: 100 },
        { id: 3, instruction: "Add milk and sugar, bring to boil while stirring.", timer: 3, temperature: 100 },
        { id: 4, instruction: "Simmer for 2-3 minutes until tea reaches desired strength.", timer: 3, temperature: 90 },
        { id: 5, instruction: "Strain and serve hot in cups. Enjoy with biscuits or snacks.", timer: null, temperature: null }
      ],
      nutrition: {
        calories: "80",
        protein: "3g",
        carbs: "12g",
        fat: "3g"
      },
      tags: ["beverage", "hot", "spiced", "traditional"]
    },
    {
      id: 6,
      name: "Tomato Soup",
      description: "Comforting and healthy soup made with fresh tomatoes, herbs, and cream for a perfect starter.",
      category: "soups",
      difficulty: "Easy",
      preparationTime: 30,
      servings: 4,
      rating: 4.3,
      estimatedCost: 80,
      status: "draft",
      isPopular: false,
      image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg",
      createdBy: "Chef Meera Singh",
      lastUpdated: "2025-01-13T13:20:00Z",
      ingredients: [
        { id: 1, name: "Tomatoes", quantity: 6, unit: "pieces", cost: 40, stock: 50 },
        { id: 2, name: "Onion", quantity: 1, unit: "piece", cost: 10, stock: 30 },
        { id: 3, name: "Garlic", quantity: 3, unit: "cloves", cost: 5, stock: 100 },
        { id: 4, name: "Fresh Cream", quantity: 50, unit: "ml", cost: 15, stock: 500 },
        { id: 5, name: "Basil Leaves", quantity: 10, unit: "pieces", cost: 10, stock: 200 }
      ],
      instructions: [
        { id: 1, instruction: "Sauté onions and garlic until translucent and fragrant.", timer: 5, temperature: 160 },
        { id: 2, instruction: "Add chopped tomatoes and cook until they break down completely.", timer: 15, temperature: 160 },
        { id: 3, instruction: "Add water, salt, and herbs. Simmer for 10 minutes.", timer: 10, temperature: 140 },
        { id: 4, instruction: "Blend the mixture until smooth and strain if desired.", timer: 5, temperature: null },
        { id: 5, instruction: "Add cream and basil leaves. Serve hot with croutons.", timer: 2, temperature: 80 }
      ],
      nutrition: {
        calories: "120",
        protein: "3g",
        carbs: "15g",
        fat: "6g"
      },
      tags: ["soup", "healthy", "vegetarian", "comfort"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(mockCategories);
      setRecipes(mockRecipes);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleRecipeEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsEditorOpen(true);
  };

  const handleRecipeDelete = (recipe) => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      setRecipes(prev => prev.filter(r => r.id !== recipe.id));
      if (selectedRecipe?.id === recipe.id) {
        setSelectedRecipe(null);
      }
    }
  };

  const handleRecipeSave = (recipeData) => {
    if (editingRecipe) {
      // Update existing recipe
      setRecipes(prev => prev.map(r => 
        r.id === editingRecipe.id ? { ...recipeData, id: editingRecipe.id } : r
      ));
    } else {
      // Add new recipe
      const newRecipe = {
        ...recipeData,
        id: Date.now(),
        rating: 0,
        createdBy: 'Current User',
        lastUpdated: new Date().toISOString()
      };
      setRecipes(prev => [newRecipe, ...prev]);
    }
    
    setIsEditorOpen(false);
    setEditingRecipe(null);
  };

  const handleCreateNew = () => {
    setEditingRecipe(null);
    setIsEditorOpen(true);
  };

  const handleExecuteRecipe = (recipe) => {
    // Navigate to kitchen interface with recipe
    window.location.href = `/kitchen-interface?recipe=${recipe.id}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainSidebar />
        <div className="ml-sidebar">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Icon name="ChefHat" size={48} color="var(--color-primary)" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">Loading Recipes...</h2>
              <p className="text-muted-foreground mt-2">Please wait while we fetch your recipes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainSidebar />
      
      <div className="ml-sidebar">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Recipe Management</h1>
              <p className="text-muted-foreground mt-1">
                Create, edit, and manage your restaurant's recipes with precision
              </p>
            </div>
            <Button
              variant="default"
              onClick={handleCreateNew}
              iconName="Plus"
              iconSize={16}
            >
              Create New Recipe
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Categories & Filters */}
            <div className="col-span-12 lg:col-span-3">
              <RecipeCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {/* Center Panel - Recipe List */}
            <div className="col-span-12 lg:col-span-6">
              <RecipeList
                recipes={recipes}
                selectedRecipe={selectedRecipe}
                onRecipeSelect={handleRecipeSelect}
                onRecipeEdit={handleRecipeEdit}
                onRecipeDelete={handleRecipeDelete}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* Right Panel - Recipe Preview */}
            <div className="col-span-12 lg:col-span-3">
              <RecipePreview
                recipe={selectedRecipe}
                onEdit={handleRecipeEdit}
                onExecute={handleExecuteRecipe}
                onClose={() => setSelectedRecipe(null)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Editor Modal */}
      <RecipeEditor
        recipe={editingRecipe}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingRecipe(null);
        }}
        onSave={handleRecipeSave}
      />
    </div>
  );
};

export default RecipeManagement;