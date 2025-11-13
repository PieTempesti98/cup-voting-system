import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { PARROCCHIE, FASCE_ETA, LIMITI_VOTI } from '../constants/voting';

/**
 * Component showing current ballot status and vote counters
 */
const BallotStatus = ({ validazione, conteggio }) => {
  return (
    <div className="mb-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Stato Scheda Corrente</h2>
        {validazione.tipo === 'valida' && (
          <span className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle size={20} /> Scheda Valida
          </span>
        )}
        {validazione.tipo === 'nulla' && (
          <span className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">
            <XCircle size={20} /> Scheda Nulla
          </span>
        )}
        {validazione.tipo === 'bianca' && (
          <span className="text-gray-400 font-medium bg-gray-100 px-4 py-2 rounded-lg">
            Nessun voto
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
        {PARROCCHIE.map(p => (
          <div key={p} className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="font-semibold mb-2 text-gray-700 text-xs sm:text-sm">{p}</div>
            {FASCE_ETA.map(f => {
              const voti = conteggio[`${p}-${f}`];
              const limite = LIMITI_VOTI[p];
              return (
                <div key={f} className="flex justify-between items-center py-1">
                  <span className="text-gray-600">{f}:</span>
                  <span className={`font-bold ${
                    voti > limite ? 'text-red-600' :
                    voti === limite ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {voti}/{limite}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Component for selecting candidates for current ballot
 */
const CandidateSelection = ({ candidati, votiCorrente, onToggleVoto }) => {
  if (candidati.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-base sm:text-lg">Nessun candidato inserito.</p>
        <p className="text-sm sm:text-base">Vai alla sezione "Gestione Candidati" per aggiungere candidati.</p>
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
            const candidatiCategoria = candidati.filter(
              c => c.parrocchia === parrocchia && c.fasciaEta === fascia
            );
            if (candidatiCategoria.length === 0) return null;

            return (
              <div key={fascia} className="mb-4 ml-0 sm:ml-4">
                <h4 className="font-medium text-gray-600 mb-2 text-sm sm:text-base px-2">
                  Fascia {fascia}
                </h4>
                <div className="space-y-2">
                  {candidatiCategoria.map(c => (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 bg-white border-2 border-gray-200 p-3 sm:p-4 rounded-xl ml-0 sm:ml-4 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all hover:shadow-md"
                    >
                      <input
                        type="checkbox"
                        checked={!!votiCorrente[c.id]}
                        onChange={() => onToggleVoto(c.id)}
                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                      />
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        {c.nome}
                      </span>
                    </label>
                  ))}
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
 * Component for ballot action buttons and summary
 */
const BallotActions = ({ onConfirmBianca, onConfirm, votiCorrente, schede, onAnnullaUltima }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onConfirmBianca}
          className="flex-1 bg-gradient-to-r from-gray-500 to-gray-400 text-white py-3.5 px-6 rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all shadow-md hover:shadow-lg font-medium transform hover:scale-105"
        >
          📄 Scheda Bianca
        </button>
        <button
          onClick={onConfirm}
          disabled={Object.keys(votiCorrente).length === 0}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3.5 px-6 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg font-medium disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100"
        >
          ✓ Conferma Scheda
        </button>
      </div>

      <div className="mt-6 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
            Schede Registrate: {schede.length}
          </h3>
          <button
            onClick={onAnnullaUltima}
            disabled={schede.length === 0}
            className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:bg-gray-100"
          >
            Annulla Ultima
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className="bg-gradient-to-br from-green-100 to-green-50 p-3 sm:p-4 rounded-xl text-center border border-green-200 shadow-sm">
            <div className="font-bold text-green-700 text-xs sm:text-sm">Valide</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-800 mt-1">
              {schede.filter(s => s.tipo === 'valida').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-50 p-3 sm:p-4 rounded-xl text-center border border-red-200 shadow-sm">
            <div className="font-bold text-red-700 text-xs sm:text-sm">Nulle</div>
            <div className="text-2xl sm:text-3xl font-bold text-red-800 mt-1">
              {schede.filter(s => s.tipo === 'nulla').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-3 sm:p-4 rounded-xl text-center border border-gray-200 shadow-sm">
            <div className="font-bold text-gray-700 text-xs sm:text-sm">Bianche</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
              {schede.filter(s => s.tipo === 'bianca').length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Main section component for Ballot Registration
 */
const SchedeSection = ({
  candidati,
  votiCorrente,
  schede,
  validazione,
  conteggio,
  onToggleVoto,
  onConfermaScheda,
  onAnnullaUltima
}) => {
  return (
    <div>
      <BallotStatus validazione={validazione} conteggio={conteggio} />
      <CandidateSelection
        candidati={candidati}
        votiCorrente={votiCorrente}
        onToggleVoto={onToggleVoto}
      />
      <BallotActions
        onConfirmBianca={() => onConfermaScheda('bianca')}
        onConfirm={() => onConfermaScheda()}
        votiCorrente={votiCorrente}
        schede={schede}
        onAnnullaUltima={onAnnullaUltima}
      />
    </div>
  );
};

export default SchedeSection;
