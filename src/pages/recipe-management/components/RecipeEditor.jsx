import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RecipeEditor = ({ recipe, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: 'easy',
    preparationTime: '',
    servings: '',
    image: '',
    ingredients: [],
    instructions: [],
    nutrition: {},
    tags: [],
    isActive: true
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '', cost: '' });
  const [newInstruction, setNewInstruction] = useState({ instruction: '', timer: '', temperature: '' });

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name || '',
        description: recipe.description || '',
        category: recipe.category || '',
        difficulty: recipe.difficulty || 'easy',
        preparationTime: recipe.preparationTime || '',
        servings: recipe.servings || '',
        image: recipe.image || '',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        nutrition: recipe.nutrition || {},
        tags: recipe.tags || [],
        isActive: recipe.status === 'active'
      });
    }
  }, [recipe]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { ...newIngredient, id: Date.now() }]
      }));
      setNewIngredient({ name: '', quantity: '', unit: '', cost: '' });
    }
  };

  const removeIngredient = (id) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  const addInstruction = () => {
    if (newInstruction.instruction) {
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, { ...newInstruction, id: Date.now() }]
      }));
      setNewInstruction({ instruction: '', timer: '', temperature: '' });
    }
  };

  const removeInstruction = (id) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter(inst => inst.id !== id)
    }));
  };

  const handleSave = () => {
    const recipeData = {
      ...formData,
      status: formData.isActive ? 'active' : 'draft',
      lastUpdated: new Date().toISOString(),
      estimatedCost: formData.ingredients.reduce((total, ing) => total + (parseFloat(ing.cost) || 0), 0)
    };
    onSave(recipeData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'ingredients', label: 'Ingredients', icon: 'Package' },
    { id: 'instructions', label: 'Instructions', icon: 'List' },
    { id: 'nutrition', label: 'Nutrition', icon: 'Activity' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          >
            Close
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-micro ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Recipe Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter recipe name"
                  required
                />
                <Input
                  label="Category"
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Main Course, Dessert"
                />
              </div>

              <Input
                label="Description"
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the recipe"
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Difficulty"
                  type="text"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  placeholder="Easy, Medium, Hard"
                />
                <Input
                  label="Prep Time (minutes)"
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                  placeholder="30"
                />
                <Input
                  label="Servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) => handleInputChange('servings', e.target.value)}
                  placeholder="4"
                />
              </div>

              <Input
                label="Image URL"
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />

              <Checkbox
                label="Active Recipe"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-6">
              {/* Add Ingredient Form */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">Add Ingredient</h3>
                <div className="grid grid-cols-4 gap-3">
                  <Input
                    label="Name"
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ingredient name"
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Amount"
                  />
                  <Input
                    label="Unit"
                    type="text"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="kg, grams, cups"
                  />
                  <Input
                    label="Cost (₹)"
                    type="number"
                    value={newIngredient.cost}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={addIngredient}
                  iconName="Plus"
                  iconSize={14}
                  className="mt-3"
                >
                  Add Ingredient
                </Button>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={ingredient.id || index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-foreground">{ingredient.name}</span>
                      <span className="text-muted-foreground">{ingredient.quantity} {ingredient.unit}</span>
                      <span className="text-muted-foreground">₹{ingredient.cost}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeIngredient(ingredient.id)}
                      iconName="Trash2"
                      iconSize={14}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-6">
              {/* Add Instruction Form */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">Add Instruction</h3>
                <div className="space-y-3">
                  <Input
                    label="Instruction"
                    type="text"
                    value={newInstruction.instruction}
                    onChange={(e) => setNewInstruction(prev => ({ ...prev, instruction: e.target.value }))}
                    placeholder="Describe the cooking step"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Timer (minutes)"
                      type="number"
                      value={newInstruction.timer}
                      onChange={(e) => setNewInstruction(prev => ({ ...prev, timer: e.target.value }))}
                      placeholder="Optional timer"
                    />
                    <Input
                      label="Temperature (°C)"
                      type="number"
                      value={newInstruction.temperature}
                      onChange={(e) => setNewInstruction(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="Optional temperature"
                    />
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={addInstruction}
                  iconName="Plus"
                  iconSize={14}
                  className="mt-3"
                >
                  Add Instruction
                </Button>
              </div>

              {/* Instructions List */}
              <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                  <div key={instruction.id || index} className="flex space-x-4 p-4 bg-card border border-border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground mb-2">{instruction.instruction}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {instruction.timer && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Timer" size={14} />
                            <span>{instruction.timer} min</span>
                          </div>
                        )}
                        {instruction.temperature && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Thermometer" size={14} />
                            <span>{instruction.temperature}°C</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeInstruction(instruction.id)}
                      iconName="Trash2"
                      iconSize={14}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Calories"
                  type="number"
                  value={formData.nutrition.calories || ''}
                  onChange={(e) => handleInputChange('nutrition', { ...formData.nutrition, calories: e.target.value })}
                  placeholder="Per serving"
                />
                <Input
                  label="Protein (g)"
                  type="number"
                  value={formData.nutrition.protein || ''}
                  onChange={(e) => handleInputChange('nutrition', { ...formData.nutrition, protein: e.target.value })}
                  placeholder="Grams"
                />
                <Input
                  label="Carbs (g)"
                  type="number"
                  value={formData.nutrition.carbs || ''}
                  onChange={(e) => handleInputChange('nutrition', { ...formData.nutrition, carbs: e.target.value })}
                  placeholder="Grams"
                />
                <Input
                  label="Fat (g)"
                  type="number"
                  value={formData.nutrition.fat || ''}
                  onChange={(e) => handleInputChange('nutrition', { ...formData.nutrition, fat: e.target.value })}
                  placeholder="Grams"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconSize={16}
          >
            Save Recipe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeEditor;