import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  preparationTime: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  allergens: string[];
  ingredients: string[];
}

export interface SelectedItem extends MenuItem {
  quantity: number;
}

interface MenuBrowserProps {
  onItemSelect: (item: MenuItem, action: string) => void;
  selectedItems: SelectedItem[];
  className?: string;
}

const MenuBrowser: React.FC<MenuBrowserProps> = ({ onItemSelect, selectedItems, className = "" }) => {
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Mock menu categories
    const mockCategories = [
      { id: "all", name: "All Items", icon: "Grid3x3" },
      { id: "appetizers", name: "Appetizers", icon: "Utensils" },
      { id: "main-course", name: "Main Course", icon: "ChefHat" },
      { id: "beverages", name: "Beverages", icon: "Coffee" },
      { id: "desserts", name: "Desserts", icon: "Cake" },
      { id: "specials", name: "Today's Special", icon: "Star" },
    ];
    // Mock menu items
    const mockMenuItems: MenuItem[] = [
      {
        id: "MI001",
        name: "Paneer Butter Masala",
        category: "main-course",
        price: 280,
        description: "Rich and creamy paneer curry with butter and tomato gravy",
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        preparationTime: 15,
        isAvailable: true,
        isVegetarian: true,
        isSpicy: true,
        allergens: ["dairy"],
        ingredients: ["paneer", "tomatoes", "cream", "spices"],
      },
      {
        id: "MI002",
        name: "Chicken Biryani",
        category: "main-course",
        price: 350,
        description: "Aromatic basmati rice with tender chicken and traditional spices",
        image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg",
        preparationTime: 25,
        isAvailable: true,
        isVegetarian: false,
        isSpicy: true,
        allergens: [],
        ingredients: ["chicken", "basmati rice", "saffron", "spices"],
      },
      {
        id: "MI003",
        name: "Samosa Chaat",
        category: "appetizers",
        price: 120,
        description: "Crispy samosas topped with chutneys and yogurt",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
        preparationTime: 8,
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["gluten"],
        ingredients: ["samosa", "yogurt", "chutneys", "onions"],
      },
      {
        id: "MI004",
        name: "Masala Chai",
        category: "beverages",
        price: 40,
        description: "Traditional Indian spiced tea with milk",
        image: "https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg",
        preparationTime: 5,
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["dairy"],
        ingredients: ["tea", "milk", "spices", "sugar"],
      },
      {
        id: "MI005",
        name: "Gulab Jamun",
        category: "desserts",
        price: 80,
        description: "Soft milk dumplings in rose-flavored sugar syrup",
        image: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg",
        preparationTime: 3,
        isAvailable: false,
        isVegetarian: true,
        isSpicy: false,
        allergens: ["dairy", "gluten"],
        ingredients: ["milk powder", "flour", "sugar", "rose water"],
      },
      {
        id: "MI006",
        name: "Dal Tadka Special",
        category: "specials",
        price: 180,
        description: "Today's special lentil curry with aromatic tempering",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
        preparationTime: 12,
        isAvailable: true,
        isVegetarian: true,
        isSpicy: true,
        allergens: [],
        ingredients: ["lentils", "onions", "tomatoes", "spices"],
      },
    ];
    setCategories(mockCategories);
    setMenuItems(mockMenuItems);
    setFilteredItems(mockMenuItems);
  }, []);

  useEffect(() => {
    let filtered = menuItems;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menuItems]);

  const getItemQuantity = (itemId: string) => {
    const selectedItem = selectedItems.find((item) => item.id === itemId);
    return selectedItem ? selectedItem.quantity : 0;
  };

  const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden transition-all ${
        item.isAvailable ? "hover:shadow-md" : "opacity-60"
      }`}
    >
      <div className="relative">
        <Image src={item.image} alt={item.name} className="w-full h-32 object-cover" />
        <div className="absolute top-2 right-2 flex space-x-1">
          {item.isVegetarian && (
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-success-foreground rounded-full"></div>
            </div>
          )}
          {item.isSpicy && (
            <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center">
              <Icon name="Flame" size={12} color="white" />
            </div>
          )}
        </div>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-foreground">{item.name}</h4>
          <span className="text-lg font-bold text-primary">₹{item.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>{item.preparationTime} min</span>
          </div>
          {item.allergens.length > 0 && (
            <div className="flex items-center space-x-1">
              <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
              <span className="text-xs text-warning">Contains: {item.allergens.join(", ")}</span>
            </div>
          )}
        </div>
        {item.isAvailable ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onItemSelect(item, "decrease")}
                disabled={getItemQuantity(item.id) === 0}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-micro"
              >
                <Icon name="Minus" size={14} />
              </button>
              <span className="w-8 text-center font-semibold">{getItemQuantity(item.id)}</span>
              <button
                onClick={() => onItemSelect(item, "increase")}
                className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-micro"
              >
                <Icon name="Plus" size={14} />
              </button>
            </div>
            <button
              onClick={() => onItemSelect(item, "add")}
              className="px-3 py-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md text-sm font-medium transition-micro"
            >
              Add to Order
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-sm text-error font-medium">Currently Unavailable</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Menu Items</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </div>
        {/* ...rest of the component... */}
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Icon name="Search" size={48} />
            <p className="mt-2">No menu items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBrowser; 