import React from 'react';

const NationalHotspotCountCard = ({ count, year, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-slate-500">Carregando total nacional...</p>
        <div className="h-8 mt-1 w-3/4 mx-auto bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <h3 className="text-sm sm:text-md font-semibold text-slate-700 mb-1">Total de Focos no Brasil - {year}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
        {typeof count === 'number' ? count.toLocaleString('pt-BR') : 'N/D'}
      </p>
    </div>
  );
};

export default NationalHotspotCountCard; 