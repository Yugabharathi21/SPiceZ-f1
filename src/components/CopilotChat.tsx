import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Cpu, User, Sparkles, ArrowUp } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface CopilotChatProps {
  initialSuggestions?: string[];
}

const CopilotChat: React.FC<CopilotChatProps> = ({ initialSuggestions = [
  'Compare tire wear for all drivers',
  'Show me Verstappen\'s fastest sectors',
  'Predict race outcome if it rains',
  'Which drivers perform best in wet conditions?',
] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          text: "Hi there! I'm your F1 Analytics Copilot. Ask me about race strategies, driver performance, or anything F1 related!",
          sender: 'bot',
          timestamp: new Date(),
          suggestions: initialSuggestions
        }
      ]);
    }
  }, [isOpen, initialSuggestions]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponses = [
        "Here's the data you requested. Based on my analysis, Red Bull has the best tire management, with degradation rates 15% lower than Mercedes.",
        "Looking at the telemetry data, Verstappen's fastest lap shows exceptional speed in sector 2, nearly 0.3s quicker than Hamilton.",
        "Let me analyze that for you. Based on historical performance, a wet race would favor drivers with strong wet weather experience like Hamilton and Alonso.",
        "I've compiled the data for wet race performance. Hamilton has won 38% of wet races he's participated in, followed by Verstappen at 31%.",
      ];

      const suggestions = [
        "How does this compare to last race?",
        "Show me sector-by-sector breakdown",
        "Which team has the best pit strategy?",
        "Predict qualifying positions for tomorrow"
      ];

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date(),
        suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="animate-slide-in-bottom mb-4 w-80 sm:w-96 h-96 f1-card flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-f1-gray bg-gradient-to-r from-f1-red to-f1-red-dark text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu size={18} />
              <span className="font-bold">F1 Analytics Copilot</span>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map(message => (
              <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-f1-red text-white rounded-tr-none'
                    : 'bg-gray-200 dark:bg-f1-gray text-gray-900 dark:text-white rounded-tl-none'
                }`}>
                  <div className="flex items-center space-x-2 mb-1 text-xs opacity-80">
                    {message.sender === 'user' ? (
                      <>
                        <span>You</span>
                        <User size={12} />
                      </>
                    ) : (
                      <>
                        <Cpu size={12} />
                        <span>F1 Copilot</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>

                {/* Suggestions */}
                {message.sender === 'bot' && message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-gray-100 dark:bg-f1-gray/50 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-f1-gray flex items-center"
                      >
                        <Sparkles size={10} className="mr-1 text-f1-red" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="mb-4">
                <div className="inline-block px-4 py-3 bg-gray-200 dark:bg-f1-gray rounded-xl rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-200"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-f1-gray flex items-center space-x-2">
            <input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about race analytics..."
              className="flex-1 py-1.5 px-3 rounded-full bg-gray-100 dark:bg-f1-gray/50 text-gray-900 dark:text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-f1-red/30"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              className={`p-2 rounded-full ${
                inputValue.trim() === '' 
                  ? 'bg-gray-200 dark:bg-f1-gray text-gray-400 dark:text-gray-500' 
                  : 'bg-f1-red text-white hover:bg-f1-red-light'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center p-3 rounded-full shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'bg-f1-red text-white rotate-45'
            : 'bg-f1-red text-white hover:bg-f1-red-light'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 bg-f1-yellow text-f1-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Scroll to Top Button (when scrolled down) */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        className="fixed bottom-5 right-20 p-3 rounded-full bg-white dark:bg-f1-gray shadow-md hover:shadow-lg transition-all duration-200 text-f1-black dark:text-white"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default CopilotChat;
