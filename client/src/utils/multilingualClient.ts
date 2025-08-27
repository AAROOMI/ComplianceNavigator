// Client-side utilities for Sarah's multilingual capabilities

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface SarahResponse {
  response: string;
  language: string;
  timestamp: string;
}

export class SarahMultilingualClient {
  private baseUrl: string;
  private currentLanguage: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.currentLanguage = localStorage.getItem('sarah-language') || 'en';
  }

  // Detect language from user input
  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sarah/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to detect language');
      }

      const { language } = await response.json();
      return language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  // Translate text to target language
  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sarah/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLanguage }),
      });

      if (!response.ok) {
        throw new Error('Failed to translate text');
      }

      const { translatedText } = await response.json();
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  // Generate response in specified language
  async generateResponse(message: string, language?: string, context?: string): Promise<SarahResponse> {
    const targetLanguage = language || this.currentLanguage;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/sarah/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          language: targetLanguage,
          context: context || 'cybersecurity compliance and NCA ECC framework'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Response generation error:', error);
      
      // Fallback responses in different languages
      const fallbacks = {
        'en': "I'm here to help you with cybersecurity compliance.",
        'ar': "أنا هنا لمساعدتك في الامتثال للأمن السيبراني.",
        'ur': "میں آپ کی سائبر سیکیورٹی کمپلائنس میں مدد کے لیے موجود ہوں۔",
        'hi': "मैं साइबर सुरक्षा अनुपालन में आपकी सहायता के लिए यहाँ हूँ।",
        'es': "Estoy aquí para ayudarte con el cumplimiento de ciberseguridad.",
        'fr': "Je suis là pour vous aider avec la conformité en cybersécurité.",
        'de': "Ich bin hier, um Ihnen bei der Cybersicherheits-Compliance zu helfen.",
        'zh': "我在这里帮助您进行网络安全合规。"
      };

      return {
        response: fallbacks[targetLanguage as keyof typeof fallbacks] || fallbacks['en'],
        language: targetLanguage,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get speech audio for text
  async generateSpeech(text: string, language?: string, voiceId?: string): Promise<Blob | null> {
    const targetLanguage = language || this.currentLanguage;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/sarah/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          language: targetLanguage,
          voiceId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      return audioBlob;
    } catch (error) {
      console.error('Speech generation error:', error);
      return null;
    }
  }

  // Get available languages
  async getAvailableLanguages(): Promise<Language[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sarah/languages`);

      if (!response.ok) {
        throw new Error('Failed to fetch languages');
      }

      const { languages } = await response.json();
      return languages;
    } catch (error) {
      console.error('Error fetching languages:', error);
      
      // Fallback language list
      return [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'zh', name: 'Chinese', nativeName: '中文' },
      ];
    }
  }

  // Set current language
  setLanguage(languageCode: string): void {
    this.currentLanguage = languageCode;
    localStorage.setItem('sarah-language', languageCode);
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Play audio from blob
  async playAudio(audioBlob: Blob): Promise<void> {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }

  // Complete conversation flow: detect, respond, and speak
  async handleConversation(userMessage: string, shouldSpeak: boolean = true): Promise<SarahResponse> {
    try {
      // Detect user's language if different from current
      const detectedLanguage = await this.detectLanguage(userMessage);
      
      // Generate response in detected or current language
      const response = await this.generateResponse(userMessage, detectedLanguage);
      
      // Generate speech if requested
      if (shouldSpeak) {
        const audioBlob = await this.generateSpeech(response.response, response.language);
        if (audioBlob) {
          this.playAudio(audioBlob);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Conversation handling error:', error);
      throw error;
    }
  }
}

// Create global instance
export const sarahClient = new SarahMultilingualClient();