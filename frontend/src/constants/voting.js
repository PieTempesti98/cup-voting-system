/**
 * Voting system configuration constants
 */

export const PARROCCHIE = ['Santo Stefano', 'San Pio X', 'Immacolata ai Passi'];

export const FASCE_ETA = ['18-35', '36-60', '61+'];

export const LIMITI_VOTI = {
  'Santo Stefano': 3,
  'San Pio X': 2,
  'Immacolata ai Passi': 1
};

export const TIPO_SCHEDA = {
  VALIDA: 'valida',
  NULLA: 'nulla',
  BIANCA: 'bianca'
};

export const STORAGE_KEYS = {
  CANDIDATI: 'cup-candidati',
  SCHEDE: 'cup-schede',
  RISULTATI: 'cup-risultati'
};
