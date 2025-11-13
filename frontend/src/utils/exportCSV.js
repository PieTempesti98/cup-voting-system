/**
 * Export voting results and ballot summary to CSV file
 * @param {Array} candidati - List of candidates
 * @param {Object} risultati - Vote results object
 * @param {Array} schede - Ballots array
 */
export const esportaCSV = (candidati, risultati, schede) => {
  const candidatiConVoti = candidati
    .map(c => ({
      ...c,
      voti: risultati[c.id] || 0
    }))
    .sort((a, b) => b.voti - a.voti);

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
