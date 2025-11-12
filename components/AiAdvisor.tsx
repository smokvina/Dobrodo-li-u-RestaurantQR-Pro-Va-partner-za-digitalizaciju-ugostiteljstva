
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { ChatMessage } from '../types';
import { createAiAdvisorChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { Send, User, Bot } from 'lucide-react';

const AiAdvisor: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
        try {
            const session = createAiAdvisorChat();
            setChatSession(session);
            
            // Send an empty message to get the initial greeting
            const stream = await session.sendMessageStream({ message: "" });
            setIsLoading(false);
            
            const initialMessage: ChatMessage = { id: crypto.randomUUID(), sender: 'ai', text: '' };
            setMessages([initialMessage]);
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => prev.map(msg => msg.id === initialMessage.id ? {...msg, text: msg.text + chunkText} : msg));
            }
        } catch (e) {
            console.error("Failed to initialize chat:", e);
            setIsLoading(false);
            setMessages([{ id: crypto.randomUUID(), sender: 'ai', text: "Došlo je do greške pri povezivanju s AI savjetnikom." }]);
        }
    };
    initChat();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), sender: 'user', text: userInput };
    const aiMessage: ChatMessage = { id: crypto.randomUUID(), sender: 'ai', text: '' };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const stream = await chatSession.sendMessageStream({ message: userInput });
        
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? {...msg, text: msg.text + chunkText} : msg));
        }

    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? {...msg, text: "Oprostite, došlo je do greške."} : msg));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><Bot size={20} /></div>}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl ${msg.sender === 'user' ? 'bg-cyan-700 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="text-white whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><User size={20}/></div>}
          </div>
        ))}
         {isLoading && messages.length > 0 && (
            <div className="flex items-start gap-3 justify-start">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><Bot size={20} /></div>
                 <div className="bg-gray-700 p-3 rounded-xl rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                 </div>
            </div>
         )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Postavite pitanje..."
            className="flex-grow bg-gray-700 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-cyan-600 text-white p-3 rounded-full hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAdvisor;
