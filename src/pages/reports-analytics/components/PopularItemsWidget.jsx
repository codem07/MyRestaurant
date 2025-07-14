import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PopularItemsWidget = () => {
  const popularItems = [
    {
      id: 1,
      name: "Butter Chicken",
      category: "Main Course",
      orders: 145,
      revenue: 72500,
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400",
      trend: "up",
      trendValue: "+12%"
    },
    {
      id: 2,
      name: "Paneer Tikka Masala",
      category: "Main Course",
      orders: 132,
      revenue: 59400,
      image: "https://images.pixabay.com/photo/2018/06/18/16/05/indian-food-3482749_640.jpg",
      trend: "up",
      trendValue: "+8%"
    },
    {
      id: 3,
      name: "Biryani Special",
      category: "Rice",
      orders: 118,
      revenue: 53100,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=400&q=80",
      trend: "down",
      trendValue: "-3%"
    },
    {
      id: 4,
      name: "Dal Makhani",
      category: "Dal",
      orders: 98,
      revenue: 29400,
      image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400",
      trend: "up",
      trendValue: "+15%"
    },
    {
      id: 5,
      name: "Naan Combo",
      category: "Bread",
      orders: 87,
      revenue: 17400,
      image: "https://images.pixabay.com/photo/2017/06/16/11/38/bread-2408026_640.jpg",
      trend: "stable",
      trendValue: "0%"
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Popular Menu Items</h3>
          <p className="text-sm text-muted-foreground">Top performing dishes this week</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Star" size={20} color="var(--color-warning)" />
          <span className="text-sm font-medium text-foreground">Top 5</span>
        </div>
      </div>

      <div className="space-y-4">
        {popularItems.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-micro">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-bold">
              {index + 1}
            </div>
            
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="ShoppingCart" size={14} color="var(--color-muted-foreground)" />
                <span className="text-sm font-medium text-foreground">{item.orders}</span>
              </div>
              <div className="text-sm text-muted-foreground">{formatCurrency(item.revenue)}</div>
            </div>
            
            <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
              <Icon name={getTrendIcon(item.trend)} size={14} />
              <span className="text-sm font-medium">{item.trendValue}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Orders:</span>
          <span className="font-medium text-foreground">580</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Total Revenue:</span>
          <span className="font-medium text-foreground">₹2,31,800</span>
        </div>
      </div>
    </div>
  );
};

export default PopularItemsWidget;