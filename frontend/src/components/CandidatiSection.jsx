import React from 'react';
import CandidateForm from './CandidateForm';
import CandidateList from './CandidateList';

/**
 * Main section component for Candidate Management
 */
const CandidatiSection = ({
  candidati,
  nuovoCandidato,
  onCandidatoChange,
  onAddCandidato,
  onDeleteCandidato
}) => {
  return (
    <div>
      <CandidateForm
        nuovoCandidato={nuovoCandidato}
        onCandidatoChange={onCandidatoChange}
        onSubmit={onAddCandidato}
      />
      <CandidateList
        candidati={candidati}
        onDelete={onDeleteCandidato}
      />
    </div>
  );
};

export default CandidatiSection;
