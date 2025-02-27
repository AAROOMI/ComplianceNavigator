import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Minimize, Maximize } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp?: number; // Added timestamp property
}

export default function VirtualAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Cybersecurity Consultant. How can I help with your compliance needs today?",
      timestamp: Date.now() // Added timestamp
    }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [avatarMood, setAvatarMood] = useState<"neutral" | "happy" | "thinking">("neutral");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Added inputRef
  const [loading, setLoading] = useState(false); // Added loading state

  // Avatar expressions based on interaction context
  const avatarExpressions = {
    neutral: "/ai-avatar-neutral.png",
    happy: "/ai-avatar-happy.png",
    thinking: "/ai-avatar-thinking.png"
  };

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock function for voice recognition
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulating voice recognition starting
      setTimeout(() => {
        setIsListening(false);
        handleUserMessage("Tell me about NCA ECC cybersecurity requirements");
      }, 3000);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUserMessage = async (content: string) => {
    setLoading(true); // Set loading to true
    // Add user message
    setMessages(prev => [...prev, { role: "user", content, timestamp: Date.now() }]);
    setInput("");

    // Show "thinking" expression
    setAvatarMood("thinking");

    try {
      // Call the AI Assistant API
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.message;

      // Add AI response
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse, timestamp: Date.now() }]);

      // Show "happy" expression briefly after responding
      setAvatarMood("happy");
      setTimeout(() => setAvatarMood("neutral"), 2000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add fallback response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting to my knowledge base. Please try again later.",
        timestamp: Date.now()
      }]);
      setAvatarMood("neutral");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserMessage(input);
      inputRef.current?.focus(); // Focus back on input after submit
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 flex flex-col items-end transition-all duration-300 z-50 ${expanded ? 'w-96 h-[500px]' : 'w-auto h-auto'}`}>
      {expanded && (
        <div className="bg-card border rounded-lg shadow-xl w-full h-full flex flex-col overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <img 
                src={avatarExpressions[avatarMood]} 
                alt="AI Assistant" 
                className="w-8 h-8 rounded-full border border-white/30" 
              />
              <h3 className="font-semibold">Cybersecurity AI Consultant</h3>
            </div>
            <button 
              onClick={() => setExpanded(false)} 
              className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto bg-muted/30">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`
                  max-w-[80%] rounded-2xl p-3 shadow-sm
                  ${message.role === 'assistant' 
                    ? 'bg-card border border-border' 
                    : 'bg-primary text-primary-foreground'}
                `}>
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1 mx-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-card border border-border max-w-[80%] rounded-2xl p-3 shadow-sm flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 bg-card">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cybersecurity compliance..."
              className="flex-grow border rounded-full px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            />
            <button 
              type="button" 
              onClick={toggleListening}
              disabled={loading}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
              title="Voice input (experimental)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
            </button>
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            </button>
          </form>
        </div>
      )}

      {!expanded && (
        <button 
          onClick={() => setExpanded(true)} 
          className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105"
        >
          <img 
            src={avatarExpressions[avatarMood]} 
            alt="AI Assistant" 
            className="w-12 h-12 rounded-full" 
          />
          {isListening && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
      )}
    </div>
  );
}