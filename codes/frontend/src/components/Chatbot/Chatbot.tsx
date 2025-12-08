import { useState, useRef, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Send, Bot, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Campus Helper AI Assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // This would call your backend API that uses OpenAI
      // For now, using a mock response
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error('Failed to get AI response');
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again later or contact support.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary-600 dark:bg-primary-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 active:scale-95 transition-all duration-300 z-50 touch-manipulation"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      {/* Chatbot Window */}
      <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] sm:rounded-lg bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-50 border-0 sm:border border-gray-200 dark:border-gray-800 transition-all duration-300">
        {/* Header */}
        <div className="bg-primary-600 dark:bg-primary-500 text-white p-3 sm:p-4 rounded-t-lg sm:rounded-t-lg flex items-center justify-between transition-colors duration-300 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <h3 className="font-semibold text-sm sm:text-base">Campus Helper AI</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 active:scale-95 transition-all duration-300 p-1 touch-manipulation"
            aria-label="Close chatbot"
          >
            <X className="h-5 w-5 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900/50 min-h-0">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors duration-300 break-words ${
                  message.role === 'user'
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors duration-300">
                <p className="text-xs sm:text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 bg-white dark:bg-gray-900 transition-colors duration-300 flex-shrink-0">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about campus..."
              className="input flex-1 text-xs sm:text-sm h-9 sm:h-10"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary p-2 sm:p-2.5 disabled:opacity-50 active:scale-95 transition-all duration-300 touch-manipulation flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chatbot;

