import React, { useState } from 'react';
import { auth } from '../firebase';
import MasterKeyModal from './MasterKeyModal';

const Header = ({ onLogout }) => {
  const [showKeyModal, setShowKeyModal] = useState(false);

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
            <button
              onClick={() => setShowKeyModal(true)}
              title="Introducir Clave Maestra"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                opacity: isMasterUnlocked ? 1 : 0.6,
                filter: isMasterUnlocked ? 'drop-shadow(0 0 5px gold)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {isMasterUnlocked ? '👑' : '🔑'}
            </button>
          </div>
        </div>
      </nav>

      {showKeyModal && (
        <MasterKeyModal onClose={() => setShowKeyModal(false)} />
      )}
    </>
  );
};

export default Header;
