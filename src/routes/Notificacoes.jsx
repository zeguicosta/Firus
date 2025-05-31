import React, { useState } from 'react';
import { FiBell, FiAlertTriangle, FiZap, FiShield, FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const fakeNotifications = [
  {
    id: 1,
    type: 'critical',
    icon: <FiAlertTriangle className="w-6 h-6 text-red-500" />,
    title: 'Alerta Máximo: Risco Extremo de Incêndio na Amazônia Central',
    description: 'Condições climáticas severas (baixa umidade, ventos fortes). Índice de perigo de fogo: 95/100. Evite qualquer atividade que possa gerar faíscas na região.',
    timestamp: 'Há 15 minutos',
    read: false,
    detailsLink: '#',
    location: 'Amazônia Central',
    source: 'INPE/Satélite NOAA-20'
  },
  {
    id: 2,
    type: 'high',
    icon: <FiZap className="w-6 h-6 text-orange-500" />,
    title: 'Atenção: Risco Elevado de Incêndio no Cerrado Goiano',
    description: 'Temperaturas elevadas e vegetação seca aumentam o risco. Índice de perigo de fogo: 78/100. Monitore as atualizações e prepare-se para possíveis evacuações.',
    timestamp: 'Há 2 horas',
    read: true,
    detailsLink: '#',
    location: 'Cerrado Goiano',
    source: 'Firus IA Analysis'
  },
  {
    id: 3,
    type: 'moderate',
    icon: <FiShield className="w-6 h-6 text-yellow-500" />,
    title: 'Aviso: Risco Moderado de Incêndio na Chapada Diamantina (BA)',
    description: 'Previsão de aumento da velocidade do vento nas próximas 12 horas. Índice de perigo de fogo: 55/100. Mantenha-se informado e siga as recomendações locais.',
    timestamp: 'Há 5 horas',
    read: false,
    detailsLink: '#',
    location: 'Chapada Diamantina (BA)',
    source: 'Defesa Civil Estadual'
  },
];

export function Notificacoes() {
  const [notifications, setNotifications] = useState(fakeNotifications);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'critical', 'high', 'moderate'

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (['critical', 'high', 'moderate'].includes(filter)) return n.type === filter;
    return true; // 'all'
  });

  const getNotificationCardStyle = (type, read) => {
    let baseStyle = 'rounded-lg shadow-md border-l-4 p-5 mb-4 transition-all duration-300 hover:shadow-lg';
    if (read) baseStyle += ' bg-gray-100 opacity-70'; else baseStyle += ' bg-white';

    switch (type) {
      case 'critical': return `${baseStyle} border-red-500`;
      case 'high': return `${baseStyle} border-orange-500`;
      case 'moderate': return `${baseStyle} border-yellow-500`;
      default: return `${baseStyle} border-gray-300`;
    }
  };

  const FilterButton = ({ value, label }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
        ${filter === value 
          ? 'bg-emerald-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <FiBell className="w-10 h-10 text-emerald-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Central de Notificações</h1>
                <p className="text-gray-600">Mantenha-se atualizado sobre os riscos de incêndio.</p>
              </div>
            </div>
            {/* Futuramente: Botão para configurações de notificação */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <FiFilter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">Filtrar por:</span>
            <FilterButton value="all" label="Todas" />
            <FilterButton value="unread" label={`Não Lidas (${notifications.filter(n => !n.read).length})`} />
            <FilterButton value="critical" label="Críticas" />
            <FilterButton value="high" label="Elevadas" />
            <FilterButton value="moderate" label="Moderadas" />
          </div>
        </div>

        {/* Lista de Notificações */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map(notif => (
              <div key={notif.id} className={getNotificationCardStyle(notif.type, notif.read)}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">{notif.icon}</div>
                  <div className="flex-grow">
                    <h2 className={`text-xl font-semibold mb-1 ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notif.title}
                    </h2>
                    <p className={`text-sm mb-2 ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>{notif.description}</p>
                    <div className="text-xs text-gray-500 space-y-1 md:space-y-0 md:flex md:items-center md:gap-4">
                      <span><strong>Local:</strong> {notif.location}</span>
                      <span><strong>Fonte:</strong> {notif.source}</span>
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                    {!notif.read && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        title="Marcar como lida"
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                      >
                        <FiBell size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      title="Excluir notificação"
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
                {notif.detailsLink && (
                  <div className="mt-3 text-right">
                    <a 
                      href={notif.detailsLink} 
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Ver Detalhes
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhuma Notificação</h2>
            <p className="text-gray-500">Não há notificações correspondentes aos filtros selecionados ou nenhuma nova notificação no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notificacoes; 