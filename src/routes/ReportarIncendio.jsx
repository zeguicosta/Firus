import React, { useState, useEffect } from 'react';
import { FiRadio, FiMapPin, FiImage, FiAlertTriangle, FiSend, FiInfo, FiCamera } from 'react-icons/fi';

export function ReportarIncendio() {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    descricao: '',
    nivelUrgencia: 'moderado',
    imagem: null,
    nomeInformante: '',
    contatoInformante: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'descricao') {
      setCharCount(value.length);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, imagem: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(7),
            longitude: position.coords.longitude.toFixed(7),
          }));
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          alert("Não foi possível obter sua localização. Por favor, insira manualmente.");
        }
      );
    } else {
      alert("Geolocalização não é suportada por este navegador.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Dados do Reporte:', formData);
    // Aqui você integraria com um backend para enviar os dados
    // Por exemplo, usando a API Fetch ou Axios

    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Alerta de incêndio enviado com sucesso! Obrigado por sua colaboração.');
    setFormData({
      latitude: '',
      longitude: '',
      descricao: '',
      nivelUrgencia: 'moderado',
      imagem: null,
      nomeInformante: '',
      contatoInformante: '',
    });
    setImagePreview(null);
    setCharCount(0);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <FiAlertTriangle size={36} />
            Reportar Incêndio
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Ajude a proteger nossas florestas. Use este formulário para reportar focos de incêndio que você observar.
          </p>
          <p className="mt-4 text-sm bg-red-700 p-3 rounded-md inline-flex items-center gap-2">
            <FiInfo size={20} />
            Em caso de emergência ou risco iminente à vida, ligue para o Corpo de Bombeiros (193).
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Localização do Incêndio</h2>
            <p className="text-sm text-gray-500 mb-4">Forneça as coordenadas ou use o botão para obter sua localização atual.</p>
            <button
              type="button"
              onClick={getLocation}
              className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <FiMapPin />
              Obter Minha Localização Atual
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  id="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="Ex: -23.550520"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  id="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Ex: -46.633308"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Descrição do Incêndio</h2>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Detalhes Observados</label>
            <textarea
              name="descricao"
              id="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows="4"
              maxLength="500"
              placeholder="Descreva o que você está vendo: tamanho aproximado, direção da fumaça, tipo de vegetação, etc."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            <p className="text-xs text-gray-500 text-right mt-1">{charCount}/500 caracteres</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Nível de Urgência Percebido</h2>
            <select
              name="nivelUrgencia"
              id="nivelUrgencia"
              value={formData.nivelUrgencia}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="baixo">Baixo (foco pequeno, distante)</option>
              <option value="moderado">Moderado (fogo visível, propagando lentamente)</option>
              <option value="alto">Alto (fogo intenso, propagando rapidamente)</option>
              <option value="critico">Crítico (risco imediato a pessoas ou propriedades)</option>
            </select>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Enviar Foto (Opcional)</h2>
            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-1">Ajuda a avaliar a situação.</label>
            <input
              type="file"
              name="imagem"
              id="imagem"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            {imagePreview && (
              <div className="mt-4 border rounded-md p-2 inline-block">
                <img src={imagePreview} alt="Pré-visualização" className="max-h-48 rounded" />
              </div>
            )}
          </div>
          
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2"><FiInfo /> Informações do Informante (Opcional)</h3>
            <p className="text-sm text-blue-600 mb-3">Seus dados podem ser úteis para validação ou contato, mas não são obrigatórios.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="nomeInformante" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                    <input
                    type="text"
                    name="nomeInformante"
                    id="nomeInformante"
                    value={formData.nomeInformante}
                    onChange={handleInputChange}
                    placeholder="Seu nome (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                <div>
                    <label htmlFor="contatoInformante" className="block text-sm font-medium text-gray-700 mb-1">Seu Contato (Telefone/Email)</label>
                    <input
                    type="text"
                    name="contatoInformante"
                    id="contatoInformante"
                    value={formData.contatoInformante}
                    onChange={handleInputChange}
                    placeholder="Seu contato (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
          >
            <FiSend />
            {isSubmitting ? 'Enviando Alerta...' : 'Enviar Alerta de Incêndio'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportarIncendio; 