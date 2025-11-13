import React from 'react';
import { Trash2 } from 'lucide-react';
import { PARROCCHIE, FASCE_ETA, LIMITI_VOTI } from '../constants/voting';

/**
 * Component for displaying the list of candidates organized by parish and age group
 */
const CandidateList = ({ candidati, onDelete }) => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-5 flex items-center gap-2">
        👥 Lista Candidati{' '}
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-lg">
          {candidati.length}
        </span>
      </h2>
      {PARROCCHIE.map(parrocchia => (
        <div key={parrocchia} className="mb-6">
          <h3 className="text-base sm:text-xl font-bold text-white mb-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg border-l-8 border-yellow-400">
            🏛️ {parrocchia}{' '}
            <span className="text-sm sm:text-base font-normal">
              (max {LIMITI_VOTI[parrocchia]} voti per fascia)
            </span>
          </h3>
          {FASCE_ETA.map(fascia => {
            const candidatiCategoria = candidati.filter(
              c => c.parrocchia === parrocchia && c.fasciaEta === fascia
            );
            return (
              <div key={fascia} className="mb-4 ml-0 sm:ml-4">
                <h4 className="font-bold text-purple-700 mb-3 text-base sm:text-lg px-2 flex items-center gap-2">
                  📊 Fascia {fascia}{' '}
                  <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {candidatiCategoria.length}
                  </span>
                </h4>
                {candidatiCategoria.length === 0 ? (
                  <p className="text-gray-400 italic ml-2 sm:ml-4 text-sm bg-gray-100 p-3 rounded-lg">
                    Nessun candidato
                  </p>
                ) : (
                  <div className="space-y-3">
                    {candidatiCategoria.map(c => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between bg-gradient-to-r from-white to-purple-50 border-2 border-purple-200 p-4 rounded-2xl ml-0 sm:ml-4 hover:from-purple-100 hover:to-pink-100 hover:border-purple-400 transition-all hover:shadow-xl transform hover:scale-105"
                      >
                        <span className="font-bold text-gray-800 text-base sm:text-lg">
                          👤 {c.nome}
                        </span>
                        <button
                          onClick={() => onDelete(c.id)}
                          className="text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CandidateList;
