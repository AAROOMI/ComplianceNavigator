import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS, Step } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { VolumeX, Volume2, Play, Square } from 'lucide-react';

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductTour({ isOpen, onClose }: ProductTourProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { actualTheme } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const tourSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Welcome to MetaWorks Compliance Platform!</h2>
          <p>I'm your AI guide, and I'll show you how this powerful cybersecurity compliance platform can transform your organization's security posture.</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? 'Unmute' : 'Mute'} Audio
            </Button>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-testid="sidebar-dashboard"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">📊 Dashboard - Your Command Center</h3>
          <p>This is your central hub where you can monitor compliance status, track risk exposure, and get real-time insights into your cybersecurity posture across all NCA ECC domains.</p>
          <ul className="text-sm space-y-1">
            <li>• View overall compliance percentage</li>
            <li>• Monitor policy health status</li>
            <li>• Track vulnerability metrics</li>
            <li>• Quick access to critical actions</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-policies"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">📋 AI Policy Generator</h3>
          <p>Generate comprehensive, NCA ECC-compliant cybersecurity policies using advanced AI technology.</p>
          <ul className="text-sm space-y-1">
            <li>• Select from 5 core compliance domains</li>
            <li>• AI-powered policy creation</li>
            <li>• Customizable templates</li>
            <li>• Export to PDF format</li>
          </ul>
          <p className="text-xs text-muted-foreground">Saves you weeks of manual policy writing!</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-risk-management"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">⚠️ Risk Management Suite</h3>
          <p>Comprehensive risk assessment and management tools to identify, evaluate, and mitigate cybersecurity risks.</p>
          <ul className="text-sm space-y-1">
            <li>• Interactive risk assessment questionnaires</li>
            <li>• Risk register management</li>
            <li>• Automated risk scoring</li>
            <li>• Mitigation plan tracking</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-user-awareness"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">🎓 User Awareness Training</h3>
          <p>Gamified cybersecurity training modules to build your team's security awareness.</p>
          <ul className="text-sm space-y-1">
            <li>• Interactive training modules</li>
            <li>• Progress tracking & analytics</li>
            <li>• Competency badges system</li>
            <li>• Customizable quizzes</li>
          </ul>
          <p className="text-xs text-muted-foreground">Transform your employees into your first line of defense!</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-user-management"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">👥 User Management</h3>
          <p>Complete user lifecycle management with role-based access control.</p>
          <ul className="text-sm space-y-1">
            <li>• Add, edit, and manage users</li>
            <li>• Role-based permissions</li>
            <li>• Activity tracking</li>
            <li>• Department organization</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-ai-consultant"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">🤖 AI Consultant</h3>
          <p>Your 24/7 cybersecurity expert powered by advanced AI technology.</p>
          <ul className="text-sm space-y-1">
            <li>• Real-time compliance guidance</li>
            <li>• Best practice recommendations</li>
            <li>• Instant answers to security questions</li>
            <li>• Context-aware assistance</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="theme-toggle"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">🌓 Personalization Options</h3>
          <p>Customize your experience with theme and language preferences.</p>
          <ul className="text-sm space-y-1">
            <li>• Light/Dark theme modes</li>
            <li>• Arabic/English language support</li>
            <li>• RTL text direction for Arabic</li>
            <li>• Smooth transitions</li>
          </ul>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-testid="compliance-overview"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">📈 Real-Time Compliance Monitoring</h3>
          <p>Monitor your organization's compliance status across all NCA ECC domains in real-time.</p>
          <ul className="text-sm space-y-1">
            <li>• Live compliance percentage tracking</li>
            <li>• Domain-specific scoring</li>
            <li>• Trend analysis and reporting</li>
            <li>• Automated alerts and notifications</li>
          </ul>
          <p className="text-xs text-muted-foreground">Stay ahead of compliance requirements!</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 Tour Complete!</h2>
          <p>You're now ready to leverage the full power of MetaWorks Compliance Platform!</p>
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="text-sm space-y-1">
              <li>✅ Reduce compliance time by 80%</li>
              <li>✅ Automate policy generation and management</li>
              <li>✅ Strengthen your security posture</li>
              <li>✅ Improve team awareness and training</li>
              <li>✅ Streamline risk management processes</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">Ready to get started? Click "Finish" and begin your compliance journey!</p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const tourStepsArabic: Step[] = [
    {
      target: 'body',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">مرحباً بك في منصة ميتاوركس للامتثال!</h2>
          <p>أنا مرشدك الذكي، وسأوضح لك كيف يمكن لهذه المنصة القوية لامتثال الأمن السيبراني أن تحول الوضع الأمني لمؤسستك.</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? 'تشغيل' : 'إيقاف'} الصوت
            </Button>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-testid="sidebar-dashboard"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">📊 لوحة القيادة - مركز التحكم</h3>
          <p>هذا هو المركز الرئيسي حيث يمكنك مراقبة حالة الامتثال وتتبع التعرض للمخاطر والحصول على رؤى فورية حول وضعك الأمني عبر جميع مجالات الهيئة الوطنية للأمن السيبراني.</p>
          <ul className="text-sm space-y-1">
            <li>• عرض نسبة الامتثال الإجمالية</li>
            <li>• مراقبة حالة صحة السياسات</li>
            <li>• تتبع مقاييس الثغرات الأمنية</li>
            <li>• الوصول السريع للإجراءات الحيوية</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-policies"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">📋 مولد السياسات الذكي</h3>
          <p>أنشئ سياسات أمن سيبراني شاملة ومتوافقة مع معايير الهيئة الوطنية باستخدام تقنية الذكاء الاصطناعي المتقدمة.</p>
          <ul className="text-sm space-y-1">
            <li>• اختر من 5 مجالات امتثال أساسية</li>
            <li>• إنشاء سياسات مدعومة بالذكاء الاصطناعي</li>
            <li>• قوالب قابلة للتخصيص</li>
            <li>• تصدير بتنسيق PDF</li>
          </ul>
          <p className="text-xs text-muted-foreground">يوفر عليك أسابيع من كتابة السياسات اليدوية!</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-risk-management"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">⚠️ مجموعة إدارة المخاطر</h3>
          <p>أدوات شاملة لتقييم وإدارة المخاطر لتحديد وتقييم وتخفيف مخاطر الأمن السيبراني.</p>
          <ul className="text-sm space-y-1">
            <li>• استبيانات تقييم المخاطر التفاعلية</li>
            <li>• إدارة سجل المخاطر</li>
            <li>• نظام تسجيل النقاط الآلي</li>
            <li>• تتبع خطط التخفيف</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-user-awareness"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">🎓 برامج التوعية للمستخدمين</h3>
          <p>وحدات تدريبية تفاعلية لبناء الوعي الأمني لفريقك.</p>
          <ul className="text-sm space-y-1">
            <li>• وحدات تدريبية تفاعلية</li>
            <li>• تتبع التقدم والتحليلات</li>
            <li>• نظام شارات الكفاءة</li>
            <li>• اختبارات قابلة للتخصيص</li>
          </ul>
          <p className="text-xs text-muted-foreground">حول موظفيك إلى خط الدفاع الأول!</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-user-management"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">👥 إدارة المستخدمين</h3>
          <p>إدارة شاملة لدورة حياة المستخدم مع التحكم في الوصول القائم على الأدوار.</p>
          <ul className="text-sm space-y-1">
            <li>• إضافة وتحرير وإدارة المستخدمين</li>
            <li>• صلاحيات قائمة على الأدوار</li>
            <li>• تتبع النشاطات</li>
            <li>• تنظيم الأقسام</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="sidebar-ai-consultant"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">🤖 المستشار الذكي</h3>
          <p>خبير الأمن السيبراني المتاح على مدار الساعة مدعوم بتقنية الذكاء الاصطناعي المتقدمة.</p>
          <ul className="text-sm space-y-1">
            <li>• إرشادات الامتثال في الوقت الفعلي</li>
            <li>• توصيات أفضل الممارسات</li>
            <li>• إجابات فورية على أسئلة الأمان</li>
            <li>• مساعدة واعية بالسياق</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-testid="theme-toggle"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">🌓 خيارات التخصيص</h3>
          <p>خصص تجربتك مع تفضيلات المظهر واللغة.</p>
          <ul className="text-sm space-y-1">
            <li>• أوضاع المظهر الفاتح/الداكن</li>
            <li>• دعم اللغة العربية/الإنجليزية</li>
            <li>• اتجاه النص من اليمين إلى اليسار للعربية</li>
            <li>• انتقالات سلسة</li>
          </ul>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-testid="compliance-overview"]',
      content: (
        <div className="space-y-3">
          <h3 className="font-semibold">📈 مراقبة الامتثال في الوقت الفعلي</h3>
          <p>راقب حالة امتثال مؤسستك عبر جميع مجالات الهيئة الوطنية للأمن السيبراني في الوقت الفعلي.</p>
          <ul className="text-sm space-y-1">
            <li>• تتبع نسبة الامتثال المباشر</li>
            <li>• تسجيل نقاط خاص بالمجال</li>
            <li>• تحليل الاتجاهات والتقارير</li>
            <li>• تنبيهات وإشعارات آلية</li>
          </ul>
          <p className="text-xs text-muted-foreground">ابق في المقدمة من متطلبات الامتثال!</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">🎉 اكتملت الجولة!</h2>
          <p>أنت الآن جاهز للاستفادة من القوة الكاملة لمنصة ميتاوركس للامتثال!</p>
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-semibold mb-2">الفوائد الرئيسية:</h4>
            <ul className="text-sm space-y-1">
              <li>✅ تقليل وقت الامتثال بنسبة 80%</li>
              <li>✅ أتمتة إنشاء وإدارة السياسات</li>
              <li>✅ تقوية وضعك الأمني</li>
              <li>✅ تحسين وعي الفريق والتدريب</li>
              <li>✅ تبسيط عمليات إدارة المخاطر</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">جاهز للبدء؟ انقر "إنهاء" وابدأ رحلة الامتثال!</p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const getCurrentSteps = () => {
    return language === 'ar' ? tourStepsArabic : tourSteps;
  };

  const speakText = (text: string) => {
    if (!speechSynthesis || isMuted) return;

    // Stop any current speech
    if (currentUtterance) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (speechSynthesis && currentUtterance) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      stopSpeech();
      onClose();
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const newIndex = action === ACTIONS.PREV ? Math.max(0, index - 1) : Math.min(getCurrentSteps().length - 1, index + 1);
      setStepIndex(newIndex);
      
      // Speak the content of the new step
      setTimeout(() => {
        const currentStep = getCurrentSteps()[newIndex];
        if (currentStep && currentStep.content && !isMuted) {
          const textContent = extractTextFromReactElement(currentStep.content);
          if (textContent) {
            speakText(textContent);
          }
        }
      }, 500);
    }
  };

  const extractTextFromReactElement = (element: any): string => {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return element.toString();
    if (!element) return '';
    
    if (React.isValidElement(element)) {
      if (element.props && (element.props as any).children) {
        if (Array.isArray((element.props as any).children)) {
          return (element.props as any).children.map(extractTextFromReactElement).join(' ');
        }
        return extractTextFromReactElement((element.props as any).children);
      }
    }
    
    if (Array.isArray(element)) {
      return element.map(extractTextFromReactElement).join(' ');
    }
    
    return '';
  };

  useEffect(() => {
    if (isOpen && stepIndex === 0 && !isMuted) {
      setTimeout(() => {
        const welcomeText = language === 'ar' 
          ? "مرحباً بك في منصة ميتاوركس للامتثال! أنا مرشدك الذكي، وسأوضح لك كيف يمكن لهذه المنصة القوية لامتثال الأمن السيبراني أن تحول الوضع الأمني لمؤسستك."
          : "Welcome to MetaWorks Compliance Platform! I'm your AI guide, and I'll show you how this powerful cybersecurity compliance platform can transform your organization's security posture.";
        speakText(welcomeText);
      }, 1000);
    }
  }, [isOpen, stepIndex, isMuted, language]);

  return (
    <Joyride
      steps={getCurrentSteps()}
      run={isOpen}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      stepIndex={stepIndex}
      styles={{
        options: {
          primaryColor: actualTheme === 'dark' ? '#ffffff' : '#000000',
          backgroundColor: actualTheme === 'dark' ? '#1a1a1a' : '#ffffff',
          textColor: actualTheme === 'dark' ? '#ffffff' : '#000000',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: actualTheme === 'dark' ? '#1a1a1a' : '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
          fontSize: 14,
          maxWidth: 400,
        },
        tooltipContent: {
          padding: '0',
        },
        buttonNext: {
          backgroundColor: '#00adb5',
          fontSize: 14,
          padding: '8px 16px',
          borderRadius: 6,
        },
        buttonBack: {
          color: actualTheme === 'dark' ? '#ffffff' : '#666666',
          fontSize: 14,
          padding: '8px 16px',
        },
        buttonSkip: {
          color: actualTheme === 'dark' ? '#ffffff' : '#666666',
          fontSize: 14,
        },
      }}
      locale={{
        back: language === 'ar' ? 'السابق' : 'Back',
        close: language === 'ar' ? 'إغلاق' : 'Close',
        last: language === 'ar' ? 'الانتهاء' : 'Finish',
        next: language === 'ar' ? 'التالي' : 'Next',
        skip: language === 'ar' ? 'تخطي' : 'Skip',
      }}
    />
  );
}