import { GoogleGenAI } from "@google/genai";

// Multilingual voice service for Sarah Johnson AI Assistant
export class MultilingualService {
  private gemini: GoogleGenAI;
  private elevenlabsApiKey: string;

  constructor() {
    this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    this.elevenlabsApiKey = process.env.ELEVENLABS_API_KEY || "";
  }

  // Detect language from text input
  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a language detection expert. Detect the language of the given text and respond with only the language code (en, ar, ur, hi, etc.). If unsure, respond with 'en'.`,
          responseMimeType: "text/plain",
        },
        contents: text,
      });

      const languageCode = response.text?.trim().toLowerCase() || 'en';
      return languageCode;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  // Translate text to target language
  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const languageNames = {
        'en': 'English',
        'ar': 'Arabic',
        'ur': 'Urdu', 
        'hi': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean'
      };

      const targetLangName = languageNames[targetLanguage as keyof typeof languageNames] || 'English';

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: `You are a professional translator. Translate the given text accurately to ${targetLangName}. Maintain the tone and context. Respond only with the translated text, no additional commentary.`,
        },
        contents: `Translate this text to ${targetLangName}: ${text}`,
      });

      return response.text || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  // Generate speech using ElevenLabs API
  async generateSpeech(text: string, language: string = 'en', voiceId?: string): Promise<Buffer | null> {
    try {
      // Map languages to appropriate ElevenLabs voice IDs
      const voiceMapping = {
        'en': 'pNInz6obpgDQGcFmaJgB', // Sarah voice for English
        'ar': 'CwhRBWXzGAHq8TQ4Fs17', // Arabic voice
        'ur': '9BWtsMINqrJLrRacOk9x', // Urdu voice  
        'hi': 'yoZ06aMxZJJ28mfd3POQ', // Hindi voice
        'es': 'EXAVITQu4vr4xnSDxMaL', // Spanish voice
        'fr': 'AZnzlk1XvdvUeBnXmlld', // French voice
        'de': 'ErXwobaYiN019PkySvjV', // German voice
        'zh': 'ODq5zmih8GrVes37Dizd', // Chinese voice
      };

      const selectedVoiceId = voiceId || voiceMapping[language as keyof typeof voiceMapping] || voiceMapping['en'];

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + selectedVoiceId, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenlabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      return audioBuffer;
    } catch (error) {
      console.error('Speech generation error:', error);
      return null;
    }
  }

  // Generate contextual response in specified language
  async generateResponse(userMessage: string, language: string = 'en', context: string = ''): Promise<string> {
    try {
      const languageNames = {
        'en': 'English',
        'ar': 'Arabic', 
        'ur': 'Urdu',
        'hi': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean'
      };

      const targetLangName = languageNames[language as keyof typeof languageNames] || 'English';

      const systemPrompt = `You are Sarah Johnson, a professional AI assistant specializing in cybersecurity compliance and the NCA ECC framework. 

Context: ${context}

Respond in ${targetLangName} with:
- Professional, helpful tone
- Accurate cybersecurity guidance
- Cultural sensitivity for the language
- Keep responses concise but informative
- Always maintain your identity as Sarah Johnson`;

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: userMessage,
      });

      return response.text || `I'm here to help you with cybersecurity compliance. (${targetLangName})`;
    } catch (error) {
      console.error('Response generation error:', error);
      return language === 'en' 
        ? "I'm here to help you with cybersecurity compliance."
        : "أنا هنا لمساعدتك في الامتثال للأمن السيبراني."; // Arabic fallback
    }
  }

  // Get available languages
  getAvailableLanguages() {
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

export const multilingualService = new MultilingualService();