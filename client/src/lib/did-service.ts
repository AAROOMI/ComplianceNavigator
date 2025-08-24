interface DIDConfig {
  apiKey: string;
  baseUrl: string;
}

interface CreateTalkRequest {
  source_url: string;
  script: {
    type: string;
    input: string;
    provider?: {
      type: string;
      voice_id?: string;
    };
  };
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    stitch?: boolean;
  };
}

interface CreateTalkResponse {
  id: string;
  status: string;
  created_at: string;
  result_url?: string;
}

interface TalkStatus {
  id: string;
  status: 'created' | 'processing' | 'done' | 'error';
  result_url?: string;
  error?: {
    message: string;
    description: string;
  };
}

class DIDService {
  private config: DIDConfig;

  constructor() {
    this.config = {
      apiKey: process.env.DID_API_KEY || '',
      baseUrl: 'https://api.d-id.com'
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `D-ID API Error: ${response.status} ${response.statusText} - ${
          errorData.message || 'Unknown error'
        }`
      );
    }

    return response.json();
  }

  async createTalk(request: CreateTalkRequest): Promise<CreateTalkResponse> {
    return this.makeRequest<CreateTalkResponse>('/talks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getTalkStatus(talkId: string): Promise<TalkStatus> {
    return this.makeRequest<TalkStatus>(`/talks/${talkId}`);
  }

  async deleteTalk(talkId: string): Promise<void> {
    await this.makeRequest(`/talks/${talkId}`, {
      method: 'DELETE',
    });
  }

  // Predefined avatar images for cybersecurity assistant
  getAvatarOptions() {
    return [
      {
        id: 'professional-woman',
        name: 'Professional Consultant',
        url: 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg',
        description: 'Professional cybersecurity consultant'
      },
      {
        id: 'security-expert',
        name: 'Security Expert',
        url: 'https://create-images-results.d-id.com/DefaultPresenters/Maya_f/image.jpeg',
        description: 'Cybersecurity expert and advisor'
      },
      {
        id: 'tech-advisor',
        name: 'Technology Advisor',
        url: 'https://create-images-results.d-id.com/DefaultPresenters/Emma_f/image.jpeg',
        description: 'Technology and compliance advisor'
      }
    ];
  }

  // Create a cybersecurity consultation talk
  async createCybersecurityTalk(
    message: string, 
    avatarUrl?: string,
    voiceId: string = 'en-US-JennyNeural'
  ): Promise<CreateTalkResponse> {
    const defaultAvatar = this.getAvatarOptions()[0].url;
    
    return this.createTalk({
      source_url: avatarUrl || defaultAvatar,
      script: {
        type: 'text',
        input: message,
        provider: {
          type: 'microsoft',
          voice_id: voiceId
        }
      },
      config: {
        fluent: true,
        pad_audio: 0.0,
        stitch: true
      }
    });
  }

  // Generate cybersecurity advice response
  generateCybersecurityResponse(topic: string, context?: string): string {
    const responses = {
      'nca-ecc': `Based on the NCA Essential Cybersecurity Controls, I recommend implementing a layered security approach. The NCA ECC framework provides comprehensive guidelines for ${context || 'organizational cybersecurity'}. Key areas to focus on include governance, defense mechanisms, resilience planning, and third-party risk management.`,
      
      'risk-assessment': `For effective risk assessment, start with asset identification and threat modeling. Consider the likelihood and impact of potential security incidents. Use frameworks like NIST or ISO 27001 to structure your assessment. ${context ? `Specifically for ${context}, focus on` : 'Focus on'} vulnerability management and continuous monitoring.`,
      
      'compliance': `Cybersecurity compliance requires ongoing commitment. Establish clear policies, conduct regular audits, and ensure staff training. ${context ? `For ${context} compliance,` : 'For compliance,'} document all processes and maintain evidence of control implementation. Regular reviews and updates are essential.`,
      
      'incident-response': `A robust incident response plan is crucial. Define roles and responsibilities, establish communication protocols, and conduct regular drills. ${context ? `In the context of ${context},` : ''} Ensure you have both technical and legal response procedures. Recovery and lessons learned phases are equally important.`,
      
      'default': `Cybersecurity is a continuous journey requiring vigilance and adaptation. ${context ? `Regarding ${context},` : ''} Focus on the fundamentals: strong authentication, regular updates, employee training, and proactive monitoring. Remember, security is everyone's responsibility in the organization.`
    };

    return responses[topic as keyof typeof responses] || responses.default;
  }

  // Helper method to poll for talk completion
  async waitForTalkCompletion(talkId: string, maxWaitTime: number = 60000): Promise<TalkStatus> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getTalkStatus(talkId);
      
      if (status.status === 'done' || status.status === 'error') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Talk generation timed out');
  }
}

export const didService = new DIDService();
export type { CreateTalkRequest, CreateTalkResponse, TalkStatus };