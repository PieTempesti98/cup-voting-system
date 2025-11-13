import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import CandidatiSection from './components/CandidatiSection';
import SchedeSection from './components/SchedeSection';
import RisultatiSection from './components/RisultatiSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useVotingLogic } from './hooks/useVotingLogic';
import { STORAGE_KEYS, TIPO_SCHEDA } from './constants/voting';
import { esportaCSV } from './utils/exportCSV';

/**
 * Main App Component
 * Manages the voting system for CUP (Consiglio di Unità Pastorale)
 */
const App = () => {
  // UI State
  const [activeTab, setActiveTab] = useState('candidati');
  const [nuovoCandidato, setNuovoCandidato] = useState({
    nome: '',
    parrocchia: 'Santo Stefano',
    fasciaEta: '18-35'
  });
  const [votiCorrente, setVotiCorrente] = useState({});

  // Persistent State (localStorage)
  const [candidati, setCandidati] = useLocalStorage(STORAGE_KEYS.CANDIDATI, []);
  const [schede, setSchede] = useLocalStorage(STORAGE_KEYS.SCHEDE, []);
  const [risultati, setRisultati] = useLocalStorage(STORAGE_KEYS.RISULTATI, {});

  // Voting logic and validation
  const { calcolaVotiPerCategoria, validaScheda } = useVotingLogic(candidati, votiCorrente);
  const conteggio = calcolaVotiPerCategoria();
  const validazione = validaScheda();

  // ========== Candidate Management ==========

  /**
   * Add a new candidate
   */
  const aggiungiCandidato = () => {
    if (!nuovoCandidato.nome.trim()) return;

    const candidato = {
      id: Date.now(),
      ...nuovoCandidato
    };

    setCandidati([...candidati, candidato]);
    setNuovoCandidato({ nome: '', parrocchia: 'Santo Stefano', fasciaEta: '18-35' });
  };

  /**
   * Delete a candidate
   */
  const eliminaCandidato = (id) => {
    setCandidati(candidati.filter(c => c.id !== id));
  };

  // ========== Ballot Management ==========

  /**
   * Toggle vote for a candidate
   */
  const toggleVoto = (candidatoId) => {
    setVotiCorrente(prev => ({
      ...prev,
      [candidatoId]: !prev[candidatoId]
    }));
  };

  /**
   * Confirm and register current ballot
   */
  const confermaScheda = (tipo = null) => {
    const validazione = tipo === TIPO_SCHEDA.BIANCA
      ? { valida: false, tipo: TIPO_SCHEDA.BIANCA }
      : validaScheda();
    const tipoScheda = tipo || validazione.tipo;

    const scheda = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('it-IT'),
      tipo: tipoScheda,
      voti: tipo === TIPO_SCHEDA.BIANCA ? {} : { ...votiCorrente }
    };

    setSchede([...schede, scheda]);

    // Update results if ballot is valid
    if (tipoScheda === TIPO_SCHEDA.VALIDA) {
      const nuoviRisultati = { ...risultati };
      Object.keys(votiCorrente).forEach(candidatoId => {
        if (votiCorrente[candidatoId]) {
          nuoviRisultati[candidatoId] = (nuoviRisultati[candidatoId] || 0) + 1;
        }
      });
      setRisultati(nuoviRisultati);
    }

    setVotiCorrente({});
  };

  /**
   * Cancel the last registered ballot
   */
  const annullaUltimaScheda = () => {
    if (schede.length === 0) return;

    const ultimaScheda = schede[schede.length - 1];

    // Update results if last ballot was valid
    if (ultimaScheda.tipo === TIPO_SCHEDA.VALIDA) {
      const nuoviRisultati = { ...risultati };
      Object.keys(ultimaScheda.voti).forEach(candidatoId => {
        if (ultimaScheda.voti[candidatoId]) {
          nuoviRisultati[candidatoId] = Math.max(0, (nuoviRisultati[candidatoId] || 0) - 1);
        }
      });
      setRisultati(nuoviRisultati);
    }

    setSchede(schede.slice(0, -1));
  };

  // ========== Results Management ==========

  /**
   * Export results to CSV file
   */
  const handleEsportaCSV = () => {
    esportaCSV(candidati, risultati, schede);
  };

  /**
   * Reset all data (with confirmation)
   */
  const resetTutto = () => {
    if (confirm('Sei sicuro di voler eliminare tutti i dati? Questa operazione non può essere annullata.')) {
      setCandidati([]);
      setSchede([]);
      setRisultati({});
      setVotiCorrente({});
      localStorage.removeItem(STORAGE_KEYS.CANDIDATI);
      localStorage.removeItem(STORAGE_KEYS.SCHEDE);
      localStorage.removeItem(STORAGE_KEYS.RISULTATI);
    }
  };

  // ========== Render ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        <Header />

        <div className="bg-white rounded-3xl shadow-2xl mb-6 overflow-hidden border-4 border-purple-200">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-6">
            {activeTab === 'candidati' && (
              <CandidatiSection
                candidati={candidati}
                nuovoCandidato={nuovoCandidato}
                onCandidatoChange={setNuovoCandidato}
                onAddCandidato={aggiungiCandidato}
                onDeleteCandidato={eliminaCandidato}
              />
            )}

            {activeTab === 'schede' && (
              <SchedeSection
                candidati={candidati}
                votiCorrente={votiCorrente}
                schede={schede}
                validazione={validazione}
                conteggio={conteggio}
                onToggleVoto={toggleVoto}
                onConfermaScheda={confermaScheda}
                onAnnullaUltima={annullaUltimaScheda}
              />
            )}

            {activeTab === 'risultati' && (
              <RisultatiSection
                candidati={candidati}
                risultati={risultati}
                schede={schede}
                onEsportaCSV={handleEsportaCSV}
                onReset={resetTutto}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
