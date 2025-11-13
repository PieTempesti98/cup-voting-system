import React from 'react';
import { Download } from 'lucide-react';
import { PARROCCHIE, FASCE_ETA } from '../constants/voting';

/**
 * Statistics summary cards
 */
const StatsSummary = ({ schede }) => {
  const stats = [
    { label: 'Totale Schede', value: schede.length, colors: 'from-blue-100 to-blue-50 border-blue-200', textColor: 'text-blue-700' },
    { label: 'Schede Valide', value: schede.filter(s => s.tipo === 'valida').length, colors: 'from-green-100 to-green-50 border-green-200', textColor: 'text-green-700' },
    { label: 'Schede Nulle', value: schede.filter(s => s.tipo === 'nulla').length, colors: 'from-red-100 to-red-50 border-red-200', textColor: 'text-red-700' },
    { label: 'Schede Bianche', value: schede.filter(s => s.tipo === 'bianca').length, colors: 'from-gray-100 to-gray-50 border-gray-200', textColor: 'text-gray-700' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className={`bg-gradient-to-br ${stat.colors} p-4 sm:p-5 rounded-xl text-center border shadow-sm hover:shadow-md transition-shadow`}>
          <div className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * Results list by parish and age group
 */
const ResultsList = ({ candidati, risultati, schede }) => {
  if (candidati.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-base sm:text-lg">Nessun candidato inserito.</p>
      </div>
    );
  }

  return (
    <div>
      {PARROCCHIE.map(parrocchia => (
        <div key={parrocchia} className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 bg-gradient-to-r from-gray-100 to-gray-50 p-3 sm:p-4 rounded-xl border-l-4 border-indigo-500">
            {parrocchia}
          </h3>
          {FASCE_ETA.map(fascia => {
            const candidatiCategoria = candidati
              .filter(c => c.parrocchia === parrocchia && c.fasciaEta === fascia)
              .map(c => ({
                ...c,
                voti: risultati[c.id] || 0
              }))
              .sort((a, b) => b.voti - a.voti);

            if (candidatiCategoria.length === 0) return null;

            return (
              <div key={fascia} className="mb-4 ml-0 sm:ml-4">
                <h4 className="font-medium text-gray-600 mb-2 text-sm sm:text-base px-2">
                  Fascia {fascia}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {candidatiCategoria.map(c => {
                    const schedeValide = schede.filter(s => s.tipo === 'valida').length;
                    const percentuale = schedeValide > 0
                      ? ((c.voti / schedeValide) * 100).toFixed(1)
                      : 0;

                    return (
                      <div key={c.id} className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl ml-0 sm:ml-4 hover:shadow-md transition-all hover:border-indigo-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            {c.nome}
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                            {c.voti}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentuale}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1.5">{percentuale}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * Main section component for Results
 */
const RisultatiSection = ({ candidati, risultati, schede, onEsportaCSV, onReset }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Risultati Scrutinio</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={onEsportaCSV}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 px-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium transform hover:scale-105"
          >
            <Download size={18} /> Esporta CSV
          </button>
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg font-medium transform hover:scale-105"
          >
            Reset Tutto
          </button>
        </div>
      </div>

      <StatsSummary schede={schede} />
      <ResultsList candidati={candidati} risultati={risultati} schede={schede} />
    </div>
  );
};

export default RisultatiSection;
