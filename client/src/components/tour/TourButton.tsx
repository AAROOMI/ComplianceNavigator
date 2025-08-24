import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductTour from './ProductTour';

interface TourButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function TourButton({ variant = 'outline', size = 'default', className }: TourButtonProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { t } = useTranslation();

  const startTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={startTour}
        className={className}
        data-testid="tour-button"
      >
        <Play className="w-4 h-4 mr-2" />
        {t('common.start')} Product Tour
      </Button>

      <ProductTour isOpen={isTourOpen} onClose={closeTour} />
    </>
  );
}

// Floating help button for easy access
export function FloatingTourButton() {
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsTourOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        data-testid="floating-tour-button"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      <ProductTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  );
}