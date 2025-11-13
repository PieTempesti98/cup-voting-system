import React from 'react';

/**
 * Tab Navigation component with three tabs
 */
const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'candidati', label: 'Gestione Candidati', shortLabel: 'Candidati', emoji: '📋', colors: 'from-blue-600 to-purple-600 shadow-purple-300' },
    { id: 'schede', label: 'Registrazione Schede', shortLabel: 'Schede', emoji: '🗳️', colors: 'from-purple-600 to-pink-600 shadow-pink-300' },
    { id: 'risultati', label: 'Risultati', shortLabel: 'Risultati', emoji: '📊', colors: 'from-pink-600 to-rose-600 shadow-rose-300' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-4 bg-gradient-to-r from-purple-100 to-pink-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-4 px-4 sm:px-6 font-bold transition-all duration-300 rounded-2xl text-base sm:text-lg ${
            activeTab === tab.id
              ? `bg-gradient-to-r ${tab.colors} text-white shadow-2xl scale-105 transform`
              : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg border-2 border-purple-200'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {tab.emoji} <span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.shortLabel}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
