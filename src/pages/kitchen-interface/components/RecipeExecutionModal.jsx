
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeExecutionModal = ({ order, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timers, setTimers] = useState({});
  const [activeTimers, setActiveTimers] = useState({});
  const [notes, setNotes] = useState('');

  // Mock recipe data - in a real app, this would come from the recipe database
  const mockRecipe = {
    name: order?.items?.[0]?.name || 'Recipe',
    totalTime: order?.estimatedTime || 25,
    difficulty: 'medium',
    ingredients: [
      { name: 'Chicken breast', quantity: '500g', prepared: false },
      { name: 'Onions', quantity: '2 medium', prepared: false },
      { name: 'Tomatoes', quantity: '400g can', prepared: false },
      { name: 'Garlic', quantity: '4 cloves', prepared: false },
      { name: 'Ginger', quantity: '1 inch piece', prepared: false },
      { name: 'Cream', quantity: '200ml', prepared: false },
      { name: 'Spices', quantity: 'as needed', prepared: false }
    ],
    steps: [
      {
        id: 1,
        instruction: 'Prepare all ingredients: dice onions, mince garlic and ginger, cut chicken into cubes',
        duration: 10,
        temperature: null,
        equipment: ['Knife', 'Cutting board'],
        tips: 'Keep chicken pieces uniform for even cooking'
      },
      {
        id: 2,
        instruction: 'Heat oil in a large pan over medium-high heat',
        duration: 2,
        temperature: 'Medium-high',
        equipment: ['Large pan', 'Stove'],
        tips: 'Oil should shimmer but not smoke'
      },
      {
        id: 3,
        instruction: 'Cook chicken pieces until golden brown on all sides',
        duration: 8,
        temperature: 'Medium-high',
        equipment: ['Large pan', 'Wooden spoon'],
        tips: 'Don\'t overcrowd the pan - cook in batches if needed'
      },
      {
        id: 4,
        instruction: 'Add onions and cook until softened',
        duration: 5,
        temperature: 'Medium',
        equipment: ['Large pan'],
        tips: 'Onions should be translucent, not browned'
      },
      {
        id: 5,
        instruction: 'Add garlic, ginger, and spices. Cook until fragrant',
        duration: 2,
        temperature: 'Medium',
        equipment: ['Large pan'],
        tips: 'Stir constantly to prevent burning'
      },
      {
        id: 6,
        instruction: 'Add tomatoes and simmer until sauce thickens',
        duration: 15,
        temperature: 'Low-medium',
        equipment: ['Large pan'],
        tips: 'Stir occasionally and adjust seasoning'
      },
      {
        id: 7,
        instruction: 'Stir in cream and simmer for final 5 minutes',
        duration: 5,
        temperature: 'Low',
        equipment: ['Large pan'],
        tips: 'Don\'t let it boil after adding cream'
      },
      {
        id: 8,
        instruction: 'Taste and adjust seasoning. Garnish and serve',
        duration: 2,
        temperature: null,
        equipment: ['Serving plates'],
        tips: 'Serve immediately while hot'
      }
    ]
  };

  const [ingredients, setIngredients] = useState(mockRecipe.ingredients);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCurrentStep(0);
      setCompletedSteps([]);
      setTimers({});
      setActiveTimers({});
      setNotes('');
      setIngredients(mockRecipe.ingredients);
    }
  }, [isOpen]);

  useEffect(() => {
    // Update active timers every second
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(stepId => {
          if (updated[stepId] > 0) {
            updated[stepId] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => [...prev, stepIndex]);
    if (stepIndex === currentStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStartTimer = (stepId, duration) => {
    setActiveTimers(prev => ({
      ...prev,
      [stepId]: duration * 60 // Convert minutes to seconds
    }));
  };

  const handleIngredientToggle = (index) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, prepared: !ing.prepared } : ing
    ));
  };

  const handleCompleteRecipe = () => {
    onComplete(order);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allStepsCompleted = completedSteps.length === mockRecipe.steps.length;
  const currentStepData = mockRecipe.steps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {mockRecipe.name}
              </h2>
              <p className="text-muted-foreground">
                Order #{order?.id} - Table {order?.tableNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-lg font-semibold text-foreground">
                {completedSteps.length}/{mockRecipe.steps.length} steps
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left Panel - Ingredients */}
          <div className="w-1/3 border-r border-border p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Ingredients
            </h3>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    ingredient.prepared
                      ? 'bg-success/10 border-success/20'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-medium ${
                      ingredient.prepared ? 'text-success line-through' : 'text-foreground'
                    }`}>
                      {ingredient.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ingredient.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => handleIngredientToggle(index)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      ingredient.prepared
                        ? 'bg-success border-success text-success-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {ingredient.prepared && (
                      <Icon name="Check" size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Center Panel - Current Step */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!allStepsCompleted ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Step {currentStep + 1} of {mockRecipe.steps.length}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {currentStepData?.temperature && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Icon name="Thermometer" size={14} />
                        <span>{currentStepData.temperature}</span>
                      </div>
                    )}
                    {currentStepData?.duration && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span>{currentStepData.duration}m</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground text-lg leading-relaxed">
                    {currentStepData?.instruction}
                  </p>
                </div>

                {currentStepData?.tips && (
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
                      <div>
                        <p className="font-medium text-primary text-sm">Pro Tip</p>
                        <p className="text-sm text-foreground mt-1">
                          {currentStepData.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData?.equipment && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Equipment needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  {currentStepData?.duration && (
                    <Button
                      variant="outline"
                      onClick={() => handleStartTimer(currentStepData.id, currentStepData.duration)}
                      iconName="Timer"
                      iconSize={16}
                      disabled={activeTimers[currentStepData.id] > 0}
                    >
                      {activeTimers[currentStepData.id] > 0 
                        ? formatTime(activeTimers[currentStepData.id])
                        : 'Start Timer'
                      }
                    </Button>
                  )}
                  
                  <Button
                    variant="success"
                    onClick={() => handleStepComplete(currentStep)}
                    iconName="CheckCircle"
                    iconSize={16}
                  >
                    Complete Step
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
                  <Icon name="CheckCircle" size={32} color="white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    Recipe Complete!
                  </h3>
                  <p className="text-muted-foreground">
                    All steps have been completed successfully.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Chef Notes</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this preparation..."
                    className="w-full p-2 bg-card border border-border rounded-md text-foreground resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  variant="success"
                  size="lg"
                  onClick={handleCompleteRecipe}
                  iconName="CheckCircle"
                  iconSize={16}
                  className="w-full"
                >
                  Mark Order Complete
                </Button>
              </div>
            )}
          </div>

          {/* Right Panel - Steps Overview */}
          <div className="w-1/3 border-l border-border p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              All Steps
            </h3>
            <div className="space-y-3">
              {mockRecipe.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    completedSteps.includes(index)
                      ? 'bg-success/10 border-success/20'
                      : index === currentStep
                      ? 'bg-primary/10 border-primary/20'
                      : 'bg-muted border-border'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      completedSteps.includes(index)
                        ? 'bg-success border-success text-success-foreground'
                        : index === currentStep
                        ? 'border-primary text-primary'
                        : 'border-border text-muted-foreground'
                    }`}>
                      {completedSteps.includes(index) ? (
                        <Icon name="Check" size={12} />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        completedSteps.includes(index)
                          ? 'text-success'
                          : index === currentStep
                          ? 'text-primary'
                          : 'text-foreground'
                      }`}>
                        Step {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {step.instruction}
                      </p>
                      {step.duration && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="Clock" size={10} />
                          <span className="text-xs text-muted-foreground">
                            {step.duration}m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeExecutionModal;
