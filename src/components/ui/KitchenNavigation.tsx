import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../AppIcon';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface EssentialAction {
  label: string;
  path?: string;
  icon: IconName;
  badge?: number;
  voiceCommand: string;
  action?: string;
}

const KitchenNavigation: React.FC = () => {
  const pathname = usePathname();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentTimer, setCurrentTimer] = useState('00:00');
  const [activeOrders] = useState(8);
  const [isListening, setIsListening] = useState(false);

  const essentialActions: EssentialAction[] = [
    {
      label: 'Orders',
      path: '/kitchen-interface',
      icon: 'ClipboardList',
      badge: activeOrders,
      voiceCommand: 'show orders'
    },
    {
      label: 'Recipes',
      path: '/recipe-management',
      icon: 'BookOpen',
      voiceCommand: 'show recipes'
    },
    {
      label: 'Timer',
      icon: 'Timer',
      action: 'timer',
      voiceCommand: 'start timer'
    },
    {
      label: 'Emergency',
      icon: 'AlertTriangle',
      action: 'emergency',
      voiceCommand: 'emergency help'
    }
  ];

  useEffect(() => {
    // Timer simulation
    const timer = setInterval(() => {
      const now = new Date();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTimer(`${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVoiceToggle = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsVoiceEnabled(!isVoiceEnabled);
      setIsListening(!isListening);
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const handleAction = (action?: string) => {
    switch (action) {
      case 'timer':
        // Timer functionality
        console.log('Timer action triggered');
        break;
      case 'emergency':
        // Emergency protocol
        console.log('Emergency action triggered');
        break;
      default:
        break;
    }
  };

  const isCurrentPath = (path: string) => pathname === path;

  return (
    <div className="sticky top-0 bg-card border-b border-border z-kitchen-nav">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section - Essential Actions */}
        <div className="flex items-center space-x-4">
          {essentialActions.map((action, index) => (
            <div key={index} className="relative">
              {action.path ? (
                <Link
                  href={action.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-micro min-h-[48px] ${
                    isCurrentPath(action.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  <Icon name={action.icon} size={20} />
                  <span className="font-medium text-kitchen">{action.label}</span>
                  {action.badge && (
                    <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                      isCurrentPath(action.path)
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {action.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => handleAction(action.action)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-micro min-h-[48px] ${
                    action.action === 'emergency' ?'bg-error hover:bg-error/90 text-error-foreground' :'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  <Icon name={action.icon} size={20} />
                  <span className="font-medium text-kitchen">{action.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Center Section - Timer Display */}
        <div className="flex items-center space-x-4">
          <div className="bg-muted px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={20} color="var(--color-muted-foreground)" />
              <span className="font-mono text-kitchen font-semibold">{currentTimer}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Voice & Navigation */}
        <div className="flex items-center space-x-4">
          {/* Voice Control Toggle */}
          <button
            onClick={handleVoiceToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-micro min-h-[48px] ${
              isVoiceEnabled
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <Icon name={isListening ? 'MicIcon' : 'MicOff'} size={20} />
            <span className="font-medium text-kitchen">
              {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
            </span>
            {isListening && (
              <div className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse-soft"></div>
            )}
          </button>

          {/* Main Navigation Access */}
          <Link
            href="/order-management"
            className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-micro min-h-[48px]"
          >
            <Icon name="Menu" size={20} />
            <span className="font-medium text-kitchen">Full Menu</span>
          </Link>
        </div>
      </div>

      {/* Voice Commands Help Bar */}
      {isVoiceEnabled && (
        <div className="bg-accent/10 border-t border-accent/20 px-6 py-2">
          <div className="flex items-center justify-center space-x-6 text-sm text-accent-foreground/80">
            <span>Voice Commands:</span>
            {essentialActions.map((action, index) => (
              <span key={index} className="font-mono">
                "{action.voiceCommand}"
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenNavigation; 