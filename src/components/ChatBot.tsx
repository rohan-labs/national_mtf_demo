'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(data.conversationHistory);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">National MTF Q&A Bot</h1>
          <p className="text-sm opacity-90">Ask me anything about the MedTech Foundation!</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Welcome to the National MTF Q&A Bot! Ask me about:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• MTF events and hackathons</li>
                <li>• Team members and committee</li>
                <li>• Innovation programmes and opportunities</li>
                <li>• How to get involved</li>
              </ul>
              
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">Quick Questions:</p>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setInputMessage("Who's on the Executive team?")}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    Who's on the Executive team?
                  </button>
                  <button
                    onClick={() => setInputMessage("What recent events have run on MTF?")}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    What recent events have run on MTF?
                  </button>
                  <button
                    onClick={() => setInputMessage("What's the Innovation Programme?")}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    What's the Innovation Programme?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="text-sm chat-markdown">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="text-lg font-bold">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-semibold">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-semibold">{children}</h3>,
                          p: ({children}) => <p>{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside">{children}</ol>,
                          li: ({children}) => <li>{children}</li>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          code: ({children}) => <code>{children}</code>,
                          a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                          blockquote: ({children}) => <blockquote>{children}</blockquote>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg">
                <div className="text-sm chat-markdown">
                  <p className="mb-0">Thinking...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about MTF events, hackathons, team members, or opportunities..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          </div>
          
          {/* Quick Questions */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInputMessage("Who's on the Executive team?")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-colors duration-200"
              >
                Executive Team
              </button>
              <button
                onClick={() => setInputMessage("What recent events have run on MTF?")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-colors duration-200"
              >
                Recent Events
              </button>
              <button
                onClick={() => setInputMessage("What's the Innovation Programme?")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-colors duration-200"
              >
                Innovation Programme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
