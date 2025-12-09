/**
 * AI Chatbot Component
 * 
 * Floating chatbot widget for AI-powered assistance
 * Uses Google Gemini API via backend
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, User, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '@/services/api';
import type { AIChatMessage } from '@/types';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: AIChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Prepare conversation history (exclude timestamps for API)
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send message to API
      const response = await apiService.sendAIChatMessage(currentInput, conversationHistory);

      // Add assistant response
      const assistantMessage: AIChatMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.response?.data?.message || error.message || 'Please try again later.'}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
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
            <h3 className="font-semibold text-sm sm:text-base">AI Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="text-white/80 hover:text-white active:scale-95 transition-all duration-300 p-1 touch-manipulation"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 active:scale-95 transition-all duration-300 p-1 touch-manipulation"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900/50 min-h-0">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <Bot className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm sm:text-base font-medium mb-1">Hello! How can I help you today?</p>
              <p className="text-xs sm:text-sm">Ask me anything about the platform.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600 dark:text-primary-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors duration-300 break-words ${
                  message.role === 'user'
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.timestamp && (
                  <p
                    className={`text-xs mt-1.5 ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 bg-white dark:bg-gray-900 transition-colors duration-300 flex-shrink-0">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
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
