import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

declare global {
  interface Window {
    didAgent?: any;
  }
}

interface SarahAIConsultantProps {
  className?: string;
}

export default function SarahAIConsultant({ className }: SarahAIConsultantProps) {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [isAgentLoaded, setIsAgentLoaded] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    // Check if D-ID agent is loaded
    const checkAgent = () => {
      if (window.didAgent || document.querySelector('[data-name="did-agent"]')) {
        setIsAgentLoaded(true);
      }
    };

    // Check immediately and set up polling
    checkAgent();
    const interval = setInterval(checkAgent, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  const startConversation = () => {
    if (!isAgentLoaded) {
      console.log('D-ID agent not loaded yet');
      return;
    }

    try {
      // Trigger the D-ID agent
      const didScript = document.querySelector('[data-name="did-agent"]');
      if (didScript) {
        // Create or trigger the agent interface
        const event = new CustomEvent('did-agent-start', {
          detail: {
            language: language === 'ar' ? 'ar' : 'en',
            mode: 'conversation'
          }
        });
        document.dispatchEvent(event);
        setIsAgentActive(true);
      }
    } catch (error) {
      console.error('Error starting D-ID agent:', error);
    }
  };

  const stopConversation = () => {
    try {
      // Stop the D-ID agent
      const event = new CustomEvent('did-agent-stop');
      document.dispatchEvent(event);
      setIsAgentActive(false);
    } catch (error) {
      console.error('Error stopping D-ID agent:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Sarah's Interactive Image */}
      <div className="relative group">
        <div
          className={`relative cursor-pointer transition-all duration-300 ${
            isAgentActive 
              ? 'ring-4 ring-primary/50 ring-offset-2 ring-offset-background' 
              : 'hover:ring-2 hover:ring-primary/30 hover:ring-offset-1 hover:ring-offset-background'
          }`}
          onClick={startConversation}
        >
          <div className="w-12 h-12 rounded-full bg-muted border-2 border-white shadow-lg transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          
          {/* Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
            isAgentActive ? 'bg-green-500 animate-pulse' : 
            isAgentLoaded ? 'bg-blue-500' : 'bg-gray-400'
          }`} />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {isAgentActive 
            ? (language === 'ar' ? 'انقر للتوقف' : 'Click to stop')
            : (language === 'ar' ? 'انقر للتحدث مع سارة' : 'Click to talk with Sarah')
          }
        </div>
      </div>

      {/* Control Buttons when active */}
      {isAgentActive && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={stopConversation}
            className="h-8 w-8 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Status indicator component for the sidebar
export function SarahStatus() {
  const [isAgentLoaded, setIsAgentLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAgent = () => {
      if (window.didAgent || document.querySelector('[data-name="did-agent"]')) {
        setIsAgentLoaded(true);
      }
    };

    checkAgent();
    const interval = setInterval(checkAgent, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-xs text-muted-foreground text-center space-y-1">
      <div>Compliance Hub v1.0</div>
      <div className="flex items-center justify-center gap-1">
        <div className={`w-2 h-2 rounded-full ${isAgentLoaded ? 'bg-green-400' : 'bg-gray-400'}`} />
        <span>{isAgentLoaded ? 'Sarah AI Ready' : 'Loading...'}</span>
      </div>
    </div>
  );
}