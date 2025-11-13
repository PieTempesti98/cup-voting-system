import React from 'react';
import { Plus } from 'lucide-react';
import { PARROCCHIE, FASCE_ETA } from '../constants/voting';

/**
 * Form component for adding new candidates
 */
const CandidateForm = ({ nuovoCandidato, onCandidatoChange, onSubmit }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-4 sm:p-6 mb-6 border-4 border-purple-300 shadow-xl">
      <h2 className="text-lg sm:text-2xl font-extrabold text-purple-900 mb-4 flex items-center gap-2">
        ✨ Aggiungi Candidato
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Nome candidato"
          value={nuovoCandidato.nome}
          onChange={(e) => onCandidatoChange({ ...nuovoCandidato, nome: e.target.value })}
          className="p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white shadow-md text-base font-medium"
          onKeyPress={handleKeyPress}
        />
        <select
          value={nuovoCandidato.parrocchia}
          onChange={(e) => onCandidatoChange({ ...nuovoCandidato, parrocchia: e.target.value })}
          className="p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white shadow-md text-base font-medium"
        >
          {PARROCCHIE.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={nuovoCandidato.fasciaEta}
          onChange={(e) => onCandidatoChange({ ...nuovoCandidato, fasciaEta: e.target.value })}
          className="p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white shadow-md text-base font-medium"
        >
          {FASCE_ETA.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <button
          onClick={onSubmit}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 font-bold text-base sm:text-lg transform hover:scale-110 active:scale-95"
        >
          <Plus size={22} /> Aggiungi
        </button>
      </div>
    </div>
  );
};

export default CandidateForm;
