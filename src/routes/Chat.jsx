import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiCpu, FiMessageSquare } from 'react-icons/fi';

export function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou a IA do Firus, especializada em dados sobre queimadas no Brasil. Como posso te ajudar hoje?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular resposta da IA (você pode integrar com uma API real aqui)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `Entendi sua pergunta sobre "${inputMessage}". Esta é uma resposta simulada da IA. Em uma implementação real, aqui seria processado dados sobre queimadas e análises baseadas nos dados do Brasil.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiMessageSquare className="text-emerald-600" />
          Firus IA
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Converse com nossa IA especializada em dados de queimadas no Brasil
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'user' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-600 text-white'
            }`}>
              {message.sender === 'user' ? <FiUser size={16} /> : <FiCpu size={16} />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
              <FiCpu size={16} />
            </div>
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua pergunta sobre queimadas..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <FiSend size={16} />
            Enviar
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Esta é uma demonstração. Em produção, seria integrada com uma IA real.
        </p>
      </div>
    </div>
  );
}

export default Chat; 