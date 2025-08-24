import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  common: {
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    dashboard: "Dashboard",
    profile: "Profile",
    help: "Help",
    back: "Back",
    next: "Next",
    previous: "Previous",
    complete: "Complete",
    start: "Start",
    continue: "Continue",
    retry: "Retry",
    submit: "Submit",
    reset: "Reset",
    close: "Close",
    open: "Open",
    view: "View",
    download: "Download",
    upload: "Upload",
    refresh: "Refresh",
    update: "Update",
    create: "Create",
    manage: "Manage",
    overview: "Overview",
    details: "Details",
    status: "Status",
    progress: "Progress",
    score: "Score",
    level: "Level",
    category: "Category",
    type: "Type",
    priority: "Priority",
    date: "Date",
    time: "Time",
    name: "Name",
    description: "Description",
    title: "Title",
    version: "Version",
    actions: "Actions"
  },
  navigation: {
    dashboard: "Dashboard",
    policies: "Policy Generator",
    assessments: "Risk Assessment", 
    userAwareness: "User Awareness",
    notifications: "Notifications",
    userManagement: "User Management",
    riskManagement: "Risk Management",
    vulnerabilityManagement: "Vulnerability Management",
    trainingMaterials: "Training Materials",
    competencyBadges: "Competency Badges",
    aiConsultant: "AI Consultant"
  },
  dashboard: {
    title: "Compliance Dashboard",
    subtitle: "Monitor your cybersecurity compliance status and manage NCA ECC controls",
    overallCompliance: "Overall Compliance",
    policyHealth: "Policy Health",
    riskExposure: "Risk Exposure",
    vulnerabilities: "Vulnerabilities",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    generatePolicy: "Generate Policy",
    startAssessment: "Start Assessment",
    viewReports: "View Reports",
    managePolicies: "Manage Policies"
  },
  themes: {
    light: "Light Mode",
    dark: "Dark Mode",
    system: "System"
  },
  languages: {
    en: "English",
    ar: "العربية"
  },
  auth: {
    welcomeBack: "Welcome back!",
    signIn: "Sign In",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUp: "Sign Up",
    firstName: "First Name",
    lastName: "Last Name",
    confirmPassword: "Confirm Password"
  },
  policies: {
    title: "Policy Generator",
    subtitle: "Generate comprehensive cybersecurity policies using AI",
    selectDomain: "Select Domain",
    selectSubdomain: "Select Subdomain",
    generatePolicy: "Generate Policy",
    generatedPolicies: "Generated Policies",
    policyContent: "Policy Content",
    downloadPdf: "Download PDF",
    savePolicy: "Save Policy"
  },
  assessments: {
    title: "Risk Assessment",
    subtitle: "Evaluate your organization's cybersecurity posture",
    startAssessment: "Start Assessment",
    assessmentResults: "Assessment Results",
    complianceScore: "Compliance Score",
    recommendations: "Recommendations",
    vulnerabilityAnalysis: "Vulnerability Analysis"
  },
  training: {
    title: "User Awareness Training",
    subtitle: "Build your cybersecurity knowledge with interactive training modules",
    modules: "Training Modules",
    badges: "Badges & Achievements",
    progress: "Detailed Progress",
    startLearning: "Start Learning",
    reviewModule: "Review Module",
    completion: "Completion",
    averageScore: "Avg Score",
    streak: "Streak",
    badges_count: "Badges"
  },
  notifications: {
    title: "Policy Notification Center",
    subtitle: "Stay updated with policy changes and compliance alerts",
    markAsRead: "Mark as Read",
    markAllRead: "Mark All as Read",
    viewDetails: "View Details",
    noNotifications: "No notifications",
    policyReview: "Policy Review",
    policyExpiry: "Policy Expiry",
    newPolicy: "New Policy",
    systemAlert: "System Alert"
  },
  userManagement: {
    title: "User Management",
    subtitle: "Manage users and their access to the compliance platform",
    addUser: "Add User",
    editUser: "Edit User",
    deleteUser: "Delete User",
    userDetails: "User Details",
    permissions: "Permissions",
    roles: "Roles",
    lastActive: "Last Active",
    status: "Status",
    department: "Department"
  },
  risk: {
    title: "Risk Management",
    subtitle: "Identify, assess, and manage cybersecurity risks",
    riskRegister: "Risk Register",
    riskAssessment: "Risk Assessment",
    mitigationPlans: "Mitigation Plans",
    riskLevel: "Risk Level",
    impact: "Impact",
    likelihood: "Likelihood",
    treatment: "Treatment"
  }
};

// Arabic translations
const ar = {
  common: {
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    search: "بحث",
    filter: "فلتر",
    export: "تصدير",
    import: "استيراد",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    dashboard: "لوحة القيادة",
    profile: "الملف الشخصي",
    help: "مساعدة",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    complete: "مكتمل",
    start: "بدء",
    continue: "متابعة",
    retry: "إعادة المحاولة",
    submit: "إرسال",
    reset: "إعادة تعيين",
    close: "إغلاق",
    open: "فتح",
    view: "عرض",
    download: "تحميل",
    upload: "رفع",
    refresh: "تحديث",
    update: "تحديث",
    create: "إنشاء",
    manage: "إدارة",
    overview: "نظرة عامة",
    details: "التفاصيل",
    status: "الحالة",
    progress: "التقدم",
    score: "النتيجة",
    level: "المستوى",
    category: "الفئة",
    type: "النوع",
    priority: "الأولوية",
    date: "التاريخ",
    time: "الوقت",
    name: "الاسم",
    description: "الوصف",
    title: "العنوان",
    version: "الإصدار",
    actions: "الإجراءات"
  },
  navigation: {
    dashboard: "لوحة القيادة",
    policies: "مولد السياسات",
    assessments: "تقييم المخاطر",
    userAwareness: "التوعية الأمنية",
    notifications: "الإشعارات",
    userManagement: "إدارة المستخدمين",
    riskManagement: "إدارة المخاطر",
    vulnerabilityManagement: "إدارة الثغرات",
    trainingMaterials: "المواد التدريبية",
    competencyBadges: "شارات الكفاءة",
    aiConsultant: "المستشار الذكي"
  },
  dashboard: {
    title: "لوحة قيادة الامتثال",
    subtitle: "راقب حالة الامتثال الأمني وأدر ضوابط الهيئة الوطنية للأمن السيبراني",
    overallCompliance: "الامتثال العام",
    policyHealth: "صحة السياسات",
    riskExposure: "التعرض للمخاطر",
    vulnerabilities: "الثغرات الأمنية",
    recentActivity: "النشاط الأخير",
    quickActions: "الإجراءات السريعة",
    generatePolicy: "إنشاء سياسة",
    startAssessment: "بدء التقييم",
    viewReports: "عرض التقارير",
    managePolicies: "إدارة السياسات"
  },
  themes: {
    light: "الوضع الفاتح",
    dark: "الوضع الداكن",
    system: "النظام"
  },
  languages: {
    en: "English",
    ar: "العربية"
  },
  auth: {
    welcomeBack: "مرحباً بعودتك!",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    signUp: "إنشاء حساب",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    confirmPassword: "تأكيد كلمة المرور"
  },
  policies: {
    title: "مولد السياسات",
    subtitle: "أنشئ سياسات أمنية شاملة باستخدام الذكاء الاصطناعي",
    selectDomain: "اختر المجال",
    selectSubdomain: "اختر المجال الفرعي",
    generatePolicy: "إنشاء سياسة",
    generatedPolicies: "السياسات المنشأة",
    policyContent: "محتوى السياسة",
    downloadPdf: "تحميل PDF",
    savePolicy: "حفظ السياسة"
  },
  assessments: {
    title: "تقييم المخاطر",
    subtitle: "قيّم الوضع الأمني لمؤسستك",
    startAssessment: "بدء التقييم",
    assessmentResults: "نتائج التقييم",
    complianceScore: "نتيجة الامتثال",
    recommendations: "التوصيات",
    vulnerabilityAnalysis: "تحليل الثغرات"
  },
  training: {
    title: "التدريب والتوعية الأمنية",
    subtitle: "طور معرفتك الأمنية من خلال وحدات التدريب التفاعلية",
    modules: "وحدات التدريب",
    badges: "الشارات والإنجازات",
    progress: "التقدم التفصيلي",
    startLearning: "بدء التعلم",
    reviewModule: "مراجعة الوحدة",
    completion: "الإكمال",
    averageScore: "المتوسط",
    streak: "التسلسل",
    badges_count: "الشارات"
  },
  notifications: {
    title: "مركز إشعارات السياسات",
    subtitle: "ابق على اطلاع بتغييرات السياسات وتنبيهات الامتثال",
    markAsRead: "تحديد كمقروء",
    markAllRead: "تحديد الكل كمقروء",
    viewDetails: "عرض التفاصيل",
    noNotifications: "لا توجد إشعارات",
    policyReview: "مراجعة السياسة",
    policyExpiry: "انتهاء صلاحية السياسة",
    newPolicy: "سياسة جديدة",
    systemAlert: "تنبيه النظام"
  },
  userManagement: {
    title: "إدارة المستخدمين",
    subtitle: "أدر المستخدمين وصلاحياتهم في منصة الامتثال",
    addUser: "إضافة مستخدم",
    editUser: "تعديل مستخدم",
    deleteUser: "حذف مستخدم",
    userDetails: "تفاصيل المستخدم",
    permissions: "الصلاحيات",
    roles: "الأدوار",
    lastActive: "آخر نشاط",
    status: "الحالة",
    department: "القسم"
  },
  risk: {
    title: "إدارة المخاطر",
    subtitle: "حدد وقيّم وأدر المخاطر الأمنية",
    riskRegister: "سجل المخاطر",
    riskAssessment: "تقييم المخاطر",
    mitigationPlans: "خطط التخفيف",
    riskLevel: "مستوى المخاطر",
    impact: "التأثير",
    likelihood: "الاحتمالية",
    treatment: "المعالجة"
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;