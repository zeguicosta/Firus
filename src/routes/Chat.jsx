import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiCpu, FiMessageSquare } from 'react-icons/fi';

// Copied from Home.jsx - consider moving to a shared utils file later
const stateIdToCsvName = {
  "BR-AC": "ACRE", "BR-AL": "ALAGOAS", "BR-AP": "AMAPÁ", "BR-AM": "AMAZONAS",
  "BR-BA": "BAHIA", "BR-CE": "CEARÁ", "BR-DF": "DISTRITO FEDERAL", "BR-ES": "ESPÍRITO SANTO",
  "BR-GO": "GOIÁS", "BR-MA": "MARANHÃO", "BR-MT": "MATO GROSSO", "BR-MS": "MATO GROSSO DO SUL",
  "BR-MG": "MINAS GERAIS", "BR-PA": "PARÁ", "BR-PB": "PARAÍBA", "BR-PR": "PARANÁ",
  "BR-PE": "PERNAMBUCO", "BR-PI": "PIAUÍ", "BR-RJ": "RIO DE JANEIRO", "BR-RN": "RIO GRANDE DO NORTE",
  "BR-RS": "RIO GRANDE DO SUL", "BR-RO": "RONDÔNIA", "BR-RR": "RORAIMA", "BR-SC": "SANTA CATARINA",
  "BR-SP": "SÃO PAULO", "BR-SE": "SERGIPE", "BR-TO": "TOCANTINS",
};

// Inverted mapping for easier lookup by CSV name
const csvNameToStateId = Object.fromEntries(Object.entries(stateIdToCsvName).map(([k, v]) => [v, k]));

export function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou a IA do Firus. Posso fornecer dados sobre queimadas no Brasil para os anos de 2022, 2023 e 2024. Pergunte-me sobre focos por estado, bioma ou o total nacional.",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // States for holding all years' data
  const [allYearsData, setAllYearsData] = useState({
    2024: { focosByState: {}, focosByBiome: {}, totalBrasil: 0, topState: null },
    2023: { focosByState: {}, focosByBiome: {}, totalBrasil: 0, topState: null },
    2022: { focosByState: {}, focosByBiome: {}, totalBrasil: 0, topState: null },
  });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const parseCsvData = (csvText, year) => {
      const lines = csvText.trim().split('\n');
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const dataLines = lines.slice(1);

      const estadoColumnIndex = header.findIndex(h => h === 'estado');
      const biomaColumnIndex = header.findIndex(h => h === 'bioma');

      if (estadoColumnIndex === -1) throw new Error(`Coluna "estado" não encontrada no CSV de ${year}.`);
      if (biomaColumnIndex === -1) throw new Error(`Coluna "bioma" não encontrada no CSV de ${year}.`);

      const focosByState = {};
      const focosByBiomeData = {};
      let totalFocosNacional = 0;

      dataLines.forEach(line => {
        const columns = line.split(',');
        if (columns.length > estadoColumnIndex && columns[estadoColumnIndex]) {
          const estadoFromCsv = columns[estadoColumnIndex].trim().toUpperCase();
          focosByState[estadoFromCsv] = (focosByState[estadoFromCsv] || 0) + 1;
          totalFocosNacional += 1;
        }
        if (columns.length > biomaColumnIndex && columns[biomaColumnIndex]) {
          const biomaFromCsv = columns[biomaColumnIndex].trim();
          if (biomaFromCsv) {
            focosByBiomeData[biomaFromCsv] = (focosByBiomeData[biomaFromCsv] || 0) + 1;
          }
        }
      });

      let topState = null;
      if (Object.keys(focosByState).length > 0) {
        topState = Object.entries(focosByState).reduce((max, current) => current[1] > max[1] ? current : max);
      }

      return { focosByState, focosByBiomeData, totalFocosNacional, topState: topState ? { name: topState[0], count: topState[1] } : null };
    };

    const fetchDataForAllYears = async () => {
      setIsDataLoading(true);
      setDataError(null);
      try {
        const years = [2024, 2023, 2022];
        const fetchedData = {};

        for (const year of years) {
          const response = await fetch(`/data/focos_br_ref_${year}.csv`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status} para dados de ${year}`);
          const csvText = await response.text();
          const parsedData = parseCsvData(csvText, year);
          fetchedData[year] = {
            focosByState: parsedData.focosByState,
            focosByBiome: parsedData.focosByBiomeData,
            totalBrasil: parsedData.totalFocosNacional,
            topState: parsedData.topState,
          };
        }
        setAllYearsData(fetchedData);
      } catch (error) {
        console.error('Falha ao carregar ou processar dados CSV para o chat:', error);
        setDataError(`Falha ao carregar dados para a IA: ${error.message}`);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Desculpe, estou com problemas para acessar meus dados no momento. Por favor, tente mais tarde. Erro: ${error.message}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDataForAllYears();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiLoading || isDataLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAiLoading(true);

    // --- Mock AI Logic --- 
    let aiResponseText = "Desculpe, não consegui entender sua pergunta. Tente perguntar sobre focos por estado (ex: 'focos em São Paulo em 2023'), bioma (ex: 'focos na Amazônia em 2022'), ou o total no Brasil (ex: 'total Brasil 2024').";
    const lowerInput = inputMessage.toLowerCase();

    // Simple year extraction (default to 2024 if not specified or invalid)
    let yearMatch = lowerInput.match(/\b(2022|2023|2024)\b/);
    let queryYear = yearMatch ? parseInt(yearMatch[0]) : 2024;
    if (!allYearsData[queryYear]) queryYear = 2024; // Fallback if year is weird

    const dataForYear = allYearsData[queryYear];

    try {
        // 1. Check for national total
        if (lowerInput.includes('total brasil') || lowerInput.includes('focos no brasil') || lowerInput.includes('quantos focos no brasil')) {
            const total = dataForYear.totalBrasil;
            aiResponseText = `Em ${queryYear}, o Brasil registrou um total de ${total.toLocaleString('pt-BR')} focos de queimada.`;
        }
        // 2. Check for state data
        else {
            let foundState = null;
            for (const csvName in csvNameToStateId) {
                if (lowerInput.includes(csvName.toLowerCase())) {
                    foundState = csvName;
                    break;
                }
            }
            if (foundState) {
                const count = dataForYear.focosByState[foundState] || 0;
                aiResponseText = `Em ${queryYear}, o estado de ${foundState.charAt(0).toUpperCase() + foundState.slice(1).toLowerCase()} teve ${count.toLocaleString('pt-BR')} focos de queimada.`;
            }
            // 3. Check for biome data
            else {
                const biomes = ["Amazônia", "Cerrado", "Mata Atlântica", "Caatinga", "Pampa", "Pantanal"];
                let foundBiome = null;
                for (const biome of biomes) {
                    if (lowerInput.includes(biome.toLowerCase())) {
                        foundBiome = biome;
                        break;
                    }
                }
                if (foundBiome) {
                    const count = dataForYear.focosByBiome[foundBiome] || 0;
                    aiResponseText = `Em ${queryYear}, o bioma ${foundBiome} registrou ${count.toLocaleString('pt-BR')} focos de queimada.`;
                }
                // 4. Check for top state
                else if (lowerInput.includes('estado com mais focos') || lowerInput.includes('top estado') || lowerInput.includes('campeão de queimadas')) {
                    if (dataForYear.topState) {
                        aiResponseText = `Em ${queryYear}, o estado com mais focos de queimada foi ${dataForYear.topState.name.charAt(0).toUpperCase() + dataForYear.topState.name.slice(1).toLowerCase()} com ${dataForYear.topState.count.toLocaleString('pt-BR')} focos.`;
                    } else {
                        aiResponseText = `Não consegui determinar o estado com mais focos para ${queryYear} no momento.`;
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error processing AI response:", err);
        aiResponseText = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.";
    }

    setTimeout(() => { // Keep timeout to simulate thinking and prevent UI freeze with complex logic later
      const aiResponse = {
        id: Date.now() + 1,
        text: dataError ? `Desculpe, estou com problemas para acessar meus dados: ${dataError}` : aiResponseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsAiLoading(false);
    }, 700);
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
        {isAiLoading && (
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
            disabled={isAiLoading || isDataLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isAiLoading || isDataLoading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <FiSend size={16} />
            Enviar
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          IA em desenvolvimento. Consultas limitadas aos dados de 2022-2024.
        </p>
      </div>
    </div>
  );
}

export default Chat; 