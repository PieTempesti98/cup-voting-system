import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';

const App = () => {
  const PARROCCHIE = ['Santo Stefano', 'San Pio X', 'Immacolata ai Passi'];
  const FASCE_ETA = ['18-35', '36-60', '61+'];
  const LIMITI_VOTI = {
    'Santo Stefano': 3,
    'San Pio X': 2,
    'Immacolata ai Passi': 1
  };

  // Carica dati salvati dal localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Errore caricamento localStorage:', error);
      return defaultValue;
    }
  };

  const [activeTab, setActiveTab] = useState('candidati');
  const [candidati, setCandidati] = useState(() => loadFromLocalStorage('cup-candidati', []));
  const [nuovoCandidato, setNuovoCandidato] = useState({
    nome: '',
    parrocchia: 'Santo Stefano',
    fasciaEta: '18-35'
  });
  const [votiCorrente, setVotiCorrente] = useState({});
  const [schede, setSchede] = useState(() => loadFromLocalStorage('cup-schede', []));
  const [risultati, setRisultati] = useState(() => loadFromLocalStorage('cup-risultati', {}));

  // Salva automaticamente i dati nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('cup-candidati', JSON.stringify(candidati));
  }, [candidati]);

  useEffect(() => {
    localStorage.setItem('cup-schede', JSON.stringify(schede));
  }, [schede]);

  useEffect(() => {
    localStorage.setItem('cup-risultati', JSON.stringify(risultati));
  }, [risultati]);

  const aggiungiCandidato = () => {
    if (!nuovoCandidato.nome.trim()) return;
    
    const candidato = {
      id: Date.now(),
      ...nuovoCandidato
    };
    
    setCandidati([...candidati, candidato]);
    setNuovoCandidato({ nome: '', parrocchia: 'Santo Stefano', fasciaEta: '18-35' });
  };

  const eliminaCandidato = (id) => {
    setCandidati(candidati.filter(c => c.id !== id));
  };

  const toggleVoto = (candidatoId) => {
    setVotiCorrente(prev => ({
      ...prev,
      [candidatoId]: !prev[candidatoId]
    }));
  };

  const calcolaVotiPerCategoria = () => {
    const conteggio = {};
    PARROCCHIE.forEach(p => {
      FASCE_ETA.forEach(f => {
        conteggio[`${p}-${f}`] = 0;
      });
    });

    candidati.forEach(c => {
      if (votiCorrente[c.id]) {
        const chiave = `${c.parrocchia}-${c.fasciaEta}`;
        conteggio[chiave]++;
      }
    });

    return conteggio;
  };

  const validaScheda = () => {
    const conteggio = calcolaVotiPerCategoria();
    
    for (const parrocchia of PARROCCHIE) {
      for (const fascia of FASCE_ETA) {
        const chiave = `${parrocchia}-${fascia}`;
        if (conteggio[chiave] > LIMITI_VOTI[parrocchia]) {
          return { valida: false, tipo: 'nulla' };
        }
      }
    }

    const totaleVoti = Object.values(votiCorrente).filter(v => v).length;
    if (totaleVoti === 0) {
      return { valida: false, tipo: 'bianca' };
    }

    return { valida: true, tipo: 'valida' };
  };

  const confermaScheda = (tipo = null) => {
    const validazione = tipo === 'bianca' ? { valida: false, tipo: 'bianca' } : validaScheda();
    const tipoScheda = tipo || validazione.tipo;
    
    const scheda = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('it-IT'),
      tipo: tipoScheda,
      voti: tipo === 'bianca' ? {} : { ...votiCorrente }
    };

    setSchede([...schede, scheda]);

    // Aggiorna risultati
    if (tipoScheda === 'valida') {
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

  const annullaUltimaScheda = () => {
    if (schede.length === 0) return;
    
    const ultimaScheda = schede[schede.length - 1];
    
    if (ultimaScheda.tipo === 'valida') {
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

  const esportaCSV = () => {
    const candidatiConVoti = candidati.map(c => ({
      ...c,
      voti: risultati[c.id] || 0
    })).sort((a, b) => b.voti - a.voti);

    let csv = 'Nome,Parrocchia,Fascia Età,Voti\n';
    candidatiConVoti.forEach(c => {
      csv += `"${c.nome}","${c.parrocchia}","${c.fasciaEta}",${c.voti}\n`;
    });

    csv += '\n\nRiepilogo Schede\n';
    csv += `Schede Valide,${schede.filter(s => s.tipo === 'valida').length}\n`;
    csv += `Schede Nulle,${schede.filter(s => s.tipo === 'nulla').length}\n`;
    csv += `Schede Bianche,${schede.filter(s => s.tipo === 'bianca').length}\n`;
    csv += `Totale Schede,${schede.length}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scrutinio_cup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const resetTutto = () => {
    if (confirm('Sei sicuro di voler eliminare tutti i dati? Questa operazione non può essere annullata.')) {
      setCandidati([]);
      setSchede([]);
      setRisultati({});
      setVotiCorrente({});
      // Pulisci anche il localStorage
      localStorage.removeItem('cup-candidati');
      localStorage.removeItem('cup-schede');
      localStorage.removeItem('cup-risultati');
    }
  };

  const conteggio = calcolaVotiPerCategoria();
  const validazione = validaScheda();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold mb-2 drop-shadow-lg">Sistema Scrutinio CUP</h1>
          <p className="text-sm sm:text-base lg:text-lg text-blue-100">Consiglio di Unità Pastorale - Gestione Elettorale</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl mb-6 overflow-hidden border-4 border-purple-200">
          <div className="flex flex-col sm:flex-row gap-2 p-4 bg-gradient-to-r from-purple-100 to-pink-100">
            <button
              onClick={() => setActiveTab('candidati')}
              className={`flex-1 py-4 px-4 sm:px-6 font-bold transition-all duration-300 rounded-2xl text-base sm:text-lg ${
                activeTab === 'candidati'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-purple-300 scale-105 transform'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg border-2 border-purple-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                📋 <span className="hidden sm:inline">Gestione Candidati</span><span className="sm:hidden">Candidati</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('schede')}
              className={`flex-1 py-4 px-4 sm:px-6 font-bold transition-all duration-300 rounded-2xl text-base sm:text-lg ${
                activeTab === 'schede'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-pink-300 scale-105 transform'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-lg border-2 border-purple-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                🗳️ <span className="hidden sm:inline">Registrazione Schede</span><span className="sm:hidden">Schede</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('risultati')}
              className={`flex-1 py-4 px-4 sm:px-6 font-bold transition-all duration-300 rounded-2xl text-base sm:text-lg ${
                activeTab === 'risultati'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-2xl shadow-rose-300 scale-105 transform'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:shadow-lg border-2 border-purple-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                📊 <span className="hidden sm:inline">Risultati</span><span className="sm:hidden">Risultati</span>
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'candidati' && (
              <div>
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-4 sm:p-6 mb-6 border-4 border-purple-300 shadow-xl">
                  <h2 className="text-lg sm:text-2xl font-extrabold text-purple-900 mb-4 flex items-center gap-2">
                    ✨ Aggiungi Candidato
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Nome candidato"
                      value={nuovoCandidato.nome}
                      onChange={(e) => setNuovoCandidato({ ...nuovoCandidato, nome: e.target.value })}
                      className="p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white shadow-md text-base font-medium"
                      onKeyPress={(e) => e.key === 'Enter' && aggiungiCandidato()}
                    />
                    <select
                      value={nuovoCandidato.parrocchia}
                      onChange={(e) => setNuovoCandidato({ ...nuovoCandidato, parrocchia: e.target.value })}
                      className="p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white shadow-md text-base font-medium"
                    >
                      {PARROCCHIE.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                      value={nuovoCandidato.fasciaEta}
                      onChange={(e) => setNuovoCandidato({ ...nuovoCandidato, fasciaEta: e.target.value })}
                      className="p-3 sm:p-4 border-3 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-transparent transition-all bg-white shadow-md text-base font-medium"
                    >
                      {FASCE_ETA.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button
                      onClick={aggiungiCandidato}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 sm:p-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 font-bold text-base sm:text-lg transform hover:scale-110 active:scale-95"
                    >
                      <Plus size={22} /> Aggiungi
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-5 flex items-center gap-2">
                  👥 Lista Candidati <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-lg">{candidati.length}</span>
                </h2>
                {PARROCCHIE.map(parrocchia => (
                  <div key={parrocchia} className="mb-6">
                    <h3 className="text-base sm:text-xl font-bold text-white mb-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg border-l-8 border-yellow-400">
                      🏛️ {parrocchia} <span className="text-sm sm:text-base font-normal">(max {LIMITI_VOTI[parrocchia]} voti per fascia)</span>
                    </h3>
                    {FASCE_ETA.map(fascia => {
                      const candidatiCategoria = candidati.filter(
                        c => c.parrocchia === parrocchia && c.fasciaEta === fascia
                      );
                      return (
                        <div key={fascia} className="mb-4 ml-0 sm:ml-4">
                          <h4 className="font-bold text-purple-700 mb-3 text-base sm:text-lg px-2 flex items-center gap-2">
                            📊 Fascia {fascia} <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">{candidatiCategoria.length}</span>
                          </h4>
                          {candidatiCategoria.length === 0 ? (
                            <p className="text-gray-400 italic ml-2 sm:ml-4 text-sm bg-gray-100 p-3 rounded-lg">Nessun candidato</p>
                          ) : (
                            <div className="space-y-3">
                              {candidatiCategoria.map(c => (
                                <div
                                  key={c.id}
                                  className="flex items-center justify-between bg-gradient-to-r from-white to-purple-50 border-2 border-purple-200 p-4 rounded-2xl ml-0 sm:ml-4 hover:from-purple-100 hover:to-pink-100 hover:border-purple-400 transition-all hover:shadow-xl transform hover:scale-105"
                                >
                                  <span className="font-bold text-gray-800 text-base sm:text-lg">👤 {c.nome}</span>
                                  <button
                                    onClick={() => eliminaCandidato(c.id)}
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
            )}

            {activeTab === 'schede' && (
              <div>
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
                    {validazione.tipo === 'bianca' && Object.keys(votiCorrente).length === 0 && (
                      <span className="text-gray-400 font-medium bg-gray-100 px-4 py-2 rounded-lg">Nessun voto</span>
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

                {candidati.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-base sm:text-lg">Nessun candidato inserito.</p>
                    <p className="text-sm sm:text-base">Vai alla sezione "Gestione Candidati" per aggiungere candidati.</p>
                  </div>
                ) : (
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
                              <h4 className="font-medium text-gray-600 mb-2 text-sm sm:text-base px-2">Fascia {fascia}</h4>
                              <div className="space-y-2">
                                {candidatiCategoria.map(c => (
                                  <label
                                    key={c.id}
                                    className="flex items-center gap-3 bg-white border-2 border-gray-200 p-3 sm:p-4 rounded-xl ml-0 sm:ml-4 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all hover:shadow-md"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!votiCorrente[c.id]}
                                      onChange={() => toggleVoto(c.id)}
                                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                                    />
                                    <span className="font-medium text-gray-700 text-sm sm:text-base">{c.nome}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => confermaScheda('bianca')}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-400 text-white py-3.5 px-6 rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all shadow-md hover:shadow-lg font-medium transform hover:scale-105"
                  >
                    📄 Scheda Bianca
                  </button>
                  <button
                    onClick={() => confermaScheda()}
                    disabled={Object.keys(votiCorrente).length === 0}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3.5 px-6 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg font-medium disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100"
                  >
                    ✓ Conferma Scheda
                  </button>
                </div>

                <div className="mt-6 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Schede Registrate: {schede.length}</h3>
                    <button
                      onClick={annullaUltimaScheda}
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
              </div>
            )}

            {activeTab === 'risultati' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Risultati Scrutinio</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={esportaCSV}
                      className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 px-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium transform hover:scale-105"
                    >
                      <Download size={18} /> Esporta CSV
                    </button>
                    <button
                      onClick={resetTutto}
                      className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 px-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg font-medium transform hover:scale-105"
                    >
                      Reset Tutto
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 sm:p-5 rounded-xl text-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-700">{schede.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Totale Schede</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 sm:p-5 rounded-xl text-center border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl sm:text-3xl font-bold text-green-700">
                      {schede.filter(s => s.tipo === 'valida').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Schede Valide</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-100 to-red-50 p-4 sm:p-5 rounded-xl text-center border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl sm:text-3xl font-bold text-red-700">
                      {schede.filter(s => s.tipo === 'nulla').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Schede Nulle</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 sm:p-5 rounded-xl text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-700">
                      {schede.filter(s => s.tipo === 'bianca').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Schede Bianche</div>
                  </div>
                </div>

                {candidati.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-base sm:text-lg">Nessun candidato inserito.</p>
                  </div>
                ) : (
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
                              <h4 className="font-medium text-gray-600 mb-2 text-sm sm:text-base px-2">Fascia {fascia}</h4>
                              <div className="space-y-2 sm:space-y-3">
                                {candidatiCategoria.map(c => {
                                  const percentuale = schede.filter(s => s.tipo === 'valida').length > 0
                                    ? ((c.voti / schede.filter(s => s.tipo === 'valida').length) * 100).toFixed(1)
                                    : 0;

                                  return (
                                    <div key={c.id} className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl ml-0 sm:ml-4 hover:shadow-md transition-all hover:border-indigo-200">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700 text-sm sm:text-base">{c.nome}</span>
                                        <span className="text-xl sm:text-2xl font-bold text-indigo-600">{c.voti}</span>
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;