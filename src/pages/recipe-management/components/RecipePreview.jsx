import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipePreview = ({ recipe, onEdit, onExecute, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!recipe) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-fit">
        <div className="text-center py-12">
          <Icon name="ChefHat" size={48} color="var(--color-muted-foreground)" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">Select a Recipe</h3>
          <p className="text-muted-foreground mt-2">Choose a recipe from the list to view details</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'ingredients', label: 'Ingredients', icon: 'Package' },
    { id: 'instructions', label: 'Instructions', icon: 'List' },
    { id: 'nutrition', label: 'Nutrition', icon: 'Activity' }
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-foreground">Prep Time</span>
          </div>
          <span className="text-lg font-semibold text-foreground">{recipe.preparationTime} min</span>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-foreground">Servings</span>
          </div>
          <span className="text-lg font-semibold text-foreground">{recipe.servings}</span>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="TrendingUp" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-foreground">Difficulty</span>
          </div>
          <span className="text-lg font-semibold text-foreground">{recipe.difficulty}</span>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="DollarSign" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-foreground">Cost</span>
          </div>
          <span className="text-lg font-semibold text-foreground">₹{recipe.estimatedCost}</span>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2">Description</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
      </div>
    </div>
  );

  const renderIngredients = () => (
    <div className="space-y-3">
      {recipe.ingredients?.map((ingredient, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center">
              <Icon name="Package" size={16} color="var(--color-muted-foreground)" />
            </div>
            <div>
              <span className="font-medium text-foreground">{ingredient.name}</span>
              <p className="text-xs text-muted-foreground">Stock: {ingredient.stock} {ingredient.unit}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-semibold text-foreground">{ingredient.quantity} {ingredient.unit}</span>
            <p className="text-xs text-muted-foreground">₹{ingredient.cost}</p>
          </div>
        </div>
      )) || <p className="text-muted-foreground">No ingredients listed</p>}
    </div>
  );

  const renderInstructions = () => (
    <div className="space-y-4">
      {recipe.instructions?.map((step, index) => (
        <div key={index} className="flex space-x-4 p-4 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-foreground mb-2">{step.instruction}</p>
            {step.timer && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Timer" size={14} />
                <span>{step.timer} minutes</span>
              </div>
            )}
            {step.temperature && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <Icon name="Thermometer" size={14} />
                <span>{step.temperature}°C</span>
              </div>
            )}
          </div>
        </div>
      )) || <p className="text-muted-foreground">No instructions available</p>}
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {recipe.nutrition && Object.entries(recipe.nutrition).map(([key, value]) => (
          <div key={key} className="bg-muted p-3 rounded-lg">
            <span className="text-sm font-medium text-foreground capitalize">{key}</span>
            <p className="text-lg font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-fit">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">{recipe.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={16}
          >
            Close
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onExecute(recipe)}
            iconName="Play"
            iconSize={14}
            className="flex-1"
          >
            Execute Recipe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(recipe)}
            iconName="Edit"
            iconSize={14}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'ingredients' && renderIngredients()}
        {activeTab === 'instructions' && renderInstructions()}
        {activeTab === 'nutrition' && renderNutrition()}
      </div>
    </div>
  );
};

export default RecipePreview;