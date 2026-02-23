import React, { useState } from 'react';
import { auth } from '../firebase';

const Header = ({ onLogout }) => {

  const handleLogout = () => {
    if (onLogout) onLogout();
    auth.signOut().catch(console.error);
    // State change in App.jsx will handle redirection to Landing
  };

  const isMasterUnlocked = sessionStorage.getItem('master_unlocked') === 'true';

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content" style={{ justifyContent: 'space-between' }}>
          <div className="nav-logo" onClick={handleLogout} title="Cerrar sesión / Ir al inicio">
            <span className="logo-text">Novelas de Monserrat</span>
            <span className="logo-sub">Versión ligera</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
