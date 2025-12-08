import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '@/services/socket';
import { apiService } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { ChatMessage } from '@/types';
import { formatDate } from '@/utils/helpers';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('userId') || 'demo-user';

  useEffect(() => {
    if (!requestId) return;

    // Connect to socket
    socketService.connect();
    socketService.joinRequestRoom(requestId);

    // Fetch existing messages
    fetchMessages();

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    socketService.onNewMessage(handleNewMessage);

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.leaveRequestRoom(requestId);
    };
  }, [requestId]);

  const fetchMessages = async () => {
    if (!requestId) return;
    setLoading(true);
    try {
      const chat = await apiService.getChatMessages(requestId);
      setMessages(chat.messages || []);
      scrollToBottom();
    } catch (error: any) {
      toast.error('Failed to load chat messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !requestId) return;

    try {
      // Send via socket for real-time
      socketService.sendMessage(requestId, newMessage);
      
      // Also send via API for persistence
      await apiService.sendMessage(requestId, newMessage);
      
      setNewMessage('');
    } catch (error: any) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link 
          to="/history" 
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Chat
        </h1>
      </div>

      <div className="card p-0 flex flex-col" style={{ height: '600px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 transition-colors duration-300">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-colors duration-300 ${
                      isOwnMessage
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{message.senderName}</p>
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        isOwnMessage 
                          ? 'text-primary-100 dark:text-primary-200' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

