
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Minimize, Maximize } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function VirtualAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Cybersecurity Consultant. How can I help with your compliance needs today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [avatarMood, setAvatarMood] = useState<"neutral" | "happy" | "thinking">("neutral");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleUserMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: "user", content }]);
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
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      
      // Show "happy" expression briefly after responding
      setAvatarMood("happy");
      setTimeout(() => setAvatarMood("neutral"), 2000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add fallback response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting to my knowledge base. Please try again later." 
      }]);
      setAvatarMood("neutral");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserMessage(input);
    }
  };

  return (
    <Card className={`fixed bottom-4 right-4 shadow-lg transition-all duration-300 ${
      expanded ? "w-96 h-[500px]" : "w-72 h-16"
    }`}>
      <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border-2 border-primary-foreground">
            <AvatarImage src={avatarExpressions[avatarMood]} alt="AI Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <span className="font-medium">Compliance Assistant</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setExpanded(!expanded)}
          className="text-primary-foreground hover:bg-primary/80"
        >
          {expanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
      
      {expanded && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-50px)]">
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((message, i) => (
              <div 
                key={i} 
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "assistant"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
                placeholder="Ask about compliance..."
              />
              <Button type="submit" size="sm">Send</Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
