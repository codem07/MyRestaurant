import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { Order } from "./OrderCard";

interface RecipeExecutionModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (order: Order | null) => void;
}

interface Ingredient {
  name: string;
  quantity: string;
  prepared: boolean;
}

interface Step {
  id: number;
  instruction: string;
  duration: number;
  temperature: string | null;
  equipment: string[];
  tips: string;
}

const RecipeExecutionModal: React.FC<RecipeExecutionModalProps> = ({ order, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [activeTimers, setActiveTimers] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState<string>("");

  // Mock recipe data - in a real app, this would come from the recipe database
  const mockRecipe = {
    name: order?.items?.[0]?.name || "Recipe",
    totalTime: order?.estimatedTime || 25,
    difficulty: "medium",
    ingredients: [
      { name: "Chicken breast", quantity: "500g", prepared: false },
      { name: "Onions", quantity: "2 medium", prepared: false },
      { name: "Tomatoes", quantity: "400g can", prepared: false },
      { name: "Garlic", quantity: "4 cloves", prepared: false },
      { name: "Ginger", quantity: "1 inch piece", prepared: false },
      { name: "Cream", quantity: "200ml", prepared: false },
      { name: "Spices", quantity: "as needed", prepared: false },
    ],
    steps: [
      {
        id: 1,
        instruction: "Prepare all ingredients: dice onions, mince garlic and ginger, cut chicken into cubes",
        duration: 10,
        temperature: null,
        equipment: ["Knife", "Cutting board"],
        tips: "Keep chicken pieces uniform for even cooking",
      },
      {
        id: 2,
        instruction: "Heat oil in a large pan over medium-high heat",
        duration: 2,
        temperature: "Medium-high",
        equipment: ["Large pan", "Stove"],
        tips: "Oil should shimmer but not smoke",
      },
      {
        id: 3,
        instruction: "Cook chicken pieces until golden brown on all sides",
        duration: 8,
        temperature: "Medium-high",
        equipment: ["Large pan", "Wooden spoon"],
        tips: "Don't overcrowd the pan - cook in batches if needed",
      },
      {
        id: 4,
        instruction: "Add onions and cook until softened",
        duration: 5,
        temperature: "Medium",
        equipment: ["Large pan"],
        tips: "Onions should be translucent, not browned",
      },
      {
        id: 5,
        instruction: "Add garlic, ginger, and spices. Cook until fragrant",
        duration: 2,
        temperature: "Medium",
        equipment: ["Large pan"],
        tips: "Stir constantly to prevent burning",
      },
      {
        id: 6,
        instruction: "Add tomatoes and simmer until sauce thickens",
        duration: 15,
        temperature: "Low-medium",
        equipment: ["Large pan"],
        tips: "Stir occasionally and adjust seasoning",
      },
      {
        id: 7,
        instruction: "Stir in cream and simmer for final 5 minutes",
        duration: 5,
        temperature: "Low",
        equipment: ["Large pan"],
        tips: "Don't let it boil after adding cream",
      },
      {
        id: 8,
        instruction: "Taste and adjust seasoning. Garnish and serve",
        duration: 2,
        temperature: null,
        equipment: ["Serving plates"],
        tips: "Serve immediately while hot",
      },
    ],
  };

  const [ingredients, setIngredients] = useState<Ingredient[]>(mockRecipe.ingredients);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCurrentStep(0);
      setCompletedSteps([]);
      setTimers({});
      setActiveTimers({});
      setNotes("");
      setIngredients(mockRecipe.ingredients);
    }
  }, [isOpen]);

  useEffect(() => {
    // Update active timers every second
    const interval = setInterval(() => {
      setActiveTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((stepId) => {
          if (updated[stepId] > 0) {
            updated[stepId] -= 1;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps((prev) => [...prev, stepIndex]);
    if (stepIndex === currentStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStartTimer = (stepId: number, duration: number) => {
    setActiveTimers((prev) => ({
      ...prev,
      [stepId]: duration * 60, // Convert minutes to seconds
    }));
  };

  const handleIngredientToggle = (index: number) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, prepared: !ing.prepared } : ing))
    );
  };

  const handleCompleteRecipe = () => {
    onComplete(order);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
              <h2 className="text-2xl font-semibold text-foreground">{mockRecipe.name}</h2>
              <p className="text-muted-foreground">Order #{order?.id} - Table {order?.tableNumber}</p>
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
        {/* ...rest of modal UI and logic... */}
      </div>
    </div>
  );
};

export default RecipeExecutionModal; 