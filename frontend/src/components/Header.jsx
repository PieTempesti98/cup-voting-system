import React from 'react';

/**
 * Header component with gradient background
 */
const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 text-white">
      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold mb-2 drop-shadow-lg">
        Sistema Scrutinio CUP
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-blue-100">
        Consiglio di Unità Pastorale - Gestione Elettorale
      </p>
    </div>
  );
};

export default Header;
