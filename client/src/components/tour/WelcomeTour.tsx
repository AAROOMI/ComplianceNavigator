import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductTour from './ProductTour';

interface WelcomeTourProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function WelcomeTour({ isVisible, onClose }: WelcomeTourProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (!isVisible) return null;

  const startTour = () => {
    setIsTourOpen(true);
  };

  const benefits = [
    {
      title: language === 'ar' ? 'توفير 80% من وقت الامتثال' : 'Save 80% of Compliance Time',
      description: language === 'ar' ? 'أتمتة إنشاء السياسات وإدارة المخاطر' : 'Automate policy generation and risk management'
    },
    {
      title: language === 'ar' ? 'ذكاء اصطناعي متقدم' : 'Advanced AI Technology',
      description: language === 'ar' ? 'مدعوم بأحدث تقنيات الذكاء الاصطناعي' : 'Powered by cutting-edge AI technology'
    },
    {
      title: language === 'ar' ? 'امتثال شامل لمعايير الهيئة' : 'Complete NCA ECC Compliance',
      description: language === 'ar' ? 'يغطي جميع المجالات الخمسة للامتثال' : 'Covers all 5 compliance domains'
    }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {language === 'ar' ? 'مرحباً بك في ميتاوركس!' : 'Welcome to MetaWorks!'}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {language === 'ar' 
                    ? 'منصتك الشاملة لامتثال الأمن السيبراني'
                    : 'Your Complete Cybersecurity Compliance Platform'
                  }
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {language === 'ar' ? '🚀 جولة صوتية تفاعلية' : '🚀 Interactive Voice Tour'}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-3">
              <h3 className="font-semibold text-base">
                {language === 'ar' ? '✨ ما ستحصل عليه:' : '✨ What You\'ll Get:'}
              </h3>
              
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">
                {language === 'ar' ? '🎯 المميزات الرئيسية:' : '🎯 Key Features:'}
              </h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>• {language === 'ar' ? 'مولد السياسات الذكي' : 'AI Policy Generator'}</div>
                <div>• {language === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment'}</div>
                <div>• {language === 'ar' ? 'التدريب والتوعية' : 'User Training'}</div>
                <div>• {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</div>
                <div>• {language === 'ar' ? 'المستشار الذكي' : 'AI Consultant'}</div>
                <div>• {language === 'ar' ? 'لوحة القيادة' : 'Dashboard'}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2">
                {isVoiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span className="text-xs">
                  {language === 'ar' ? 'التعليق الصوتي' : 'Voice Narration'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className="text-xs px-2 py-1 h-auto"
              >
                {isVoiceEnabled ? 
                  (language === 'ar' ? 'إيقاف' : 'Disable') : 
                  (language === 'ar' ? 'تشغيل' : 'Enable')
                }
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={startTour} 
                className="flex-1 flex items-center gap-2 text-sm"
                data-testid="start-welcome-tour"
              >
                <Play className="w-4 h-4" />
                {language === 'ar' ? 'ابدأ الجولة الصوتية' : 'Start Voice Tour'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-4 text-sm"
              >
                {language === 'ar' ? 'تخطي' : 'Skip'}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {language === 'ar' 
                ? 'الجولة تستغرق 5 دقائق'
                : '5-minute guided tour'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <ProductTour 
        isOpen={isTourOpen} 
        onClose={() => {
          setIsTourOpen(false);
          onClose();
        }} 
      />
    </>
  );
}