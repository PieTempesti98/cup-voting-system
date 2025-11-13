import { LIMITI_VOTI, FASCE_ETA, PARROCCHIE, TIPO_SCHEDA } from '../constants/voting';

/**
 * Custom hook for voting logic and validation
 * @param {Array} candidati - List of candidates
 * @param {Object} votiCorrente - Current votes object
 * @returns {Object} - Validation and counting functions
 */
export const useVotingLogic = (candidati, votiCorrente) => {
  /**
   * Calculate votes per category (parish + age group)
   */
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

  /**
   * Validate current ballot according to voting rules
   */
  const validaScheda = () => {
    const conteggio = calcolaVotiPerCategoria();

    // Check if any category exceeds the vote limit
    for (const parrocchia of PARROCCHIE) {
      for (const fascia of FASCE_ETA) {
        const chiave = `${parrocchia}-${fascia}`;
        if (conteggio[chiave] > LIMITI_VOTI[parrocchia]) {
          return { valida: false, tipo: TIPO_SCHEDA.NULLA };
        }
      }
    }

    // Check if ballot is blank (no votes)
    const totaleVoti = Object.values(votiCorrente).filter(v => v).length;
    if (totaleVoti === 0) {
      return { valida: false, tipo: TIPO_SCHEDA.BIANCA };
    }

    return { valida: true, tipo: TIPO_SCHEDA.VALIDA };
  };

  return {
    calcolaVotiPerCategoria,
    validaScheda
  };
};
