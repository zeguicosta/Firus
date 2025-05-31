import React, { useState } from 'react';
import { FiHelpCircle, FiMail, FiPhone, FiMessageCircle, FiChevronDown, FiChevronUp, FiSend, FiBook, FiUsers, FiSettings, FiMessageSquare } from 'react-icons/fi';

export function Suporte() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqItems = [
    {
      id: 1,
      question: "Como funciona o sistema de monitoramento do Firus?",
      answer: "O Firus utiliza dados de satélites e sensores terrestres para monitorar queimadas em tempo real. Nossa IA analisa padrões de calor, fumaça e outras variáveis para detectar e prever incêndios florestais."
    },
    {
      id: 2,
      question: "Os dados mostrados são atualizados em tempo real?",
      answer: "Sim, nossos dados são atualizados a cada 15 minutos com informações dos principais satélites de monitoramento ambiental, incluindo NOAA, NASA e INPE."
    },
    {
      id: 3,
      question: "Como posso receber alertas sobre queimadas na minha região?",
      answer: "Você pode configurar alertas personalizados na seção de Notificações, selecionando sua região de interesse e definindo os tipos de alertas que deseja receber."
    },
    {
      id: 4,
      question: "O Firus IA pode ajudar na prevenção de incêndios?",
      answer: "Sim! Nossa IA pode fornecer análises preditivas baseadas em condições climáticas, histórico de queimadas e fatores de risco, ajudando na prevenção e planejamento de combate a incêndios."
    },
    {
      id: 5,
      question: "Como interpretar os mapas de risco de fogo?",
      answer: "Os mapas usam uma escala de cores: verde (baixo risco), amarelo (risco moderado), laranja (alto risco) e vermelho (risco crítico). Clique em qualquer região para ver dados detalhados."
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementaria o envio do formulário
    console.log('Formulário enviado:', formData);
    alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <FiHelpCircle className="text-emerald-600" />
              Central de Suporte
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre respostas para suas dúvidas ou entre em contato conosco. Estamos aqui para ajudar!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiBook className="text-emerald-600" />
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      {expandedFaq === item.id ? (
                        <FiChevronUp className="text-emerald-600 flex-shrink-0 ml-2" />
                      ) : (
                        <FiChevronDown className="text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                    
                    {expandedFaq === item.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida-tecnica">Dúvida Técnica</option>
                    <option value="problema-dados">Problema com Dados</option>
                    <option value="sugestao">Sugestão de Melhoria</option>
                    <option value="partnership">Parceria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Descreva sua dúvida ou problema..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FiSend size={16} />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contato Direto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FiMail className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">E-mail</p>
                    <p className="text-sm text-gray-600">suporte@firus.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FiMessageCircle className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">(11) 97326-2444</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FiPhone className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <p className="text-sm text-gray-600">(11) 3000-0000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categorias de Ajuda</h3>
              
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiUsers className="text-emerald-600" />
                  <span className="text-gray-700">Primeiros Passos</span>
                </a>
                
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiSettings className="text-emerald-600" />
                  <span className="text-gray-700">Configurações</span>
                </a>
                
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiMessageSquare className="text-emerald-600" />
                  <span className="text-gray-700">Firus IA</span>
                </a>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status do Sistema</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Plataforma</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operacional
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">IA Chat</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operacional
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Dados Satélite</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operacional
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suporte; 