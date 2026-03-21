import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    auth.signOut().catch(console.error);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content" style={{ justifyContent: 'space-between' }}>
          <div className="nav-logo" onClick={() => navigate('/')} title="Ir al inicio" style={{ cursor: 'pointer' }}>
            <span className="logo-text">Novelas de Monserrat</span>
            <span className="logo-sub">Versión ligera</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
                onClick={handleLogout} 
                className="btn" 
                style={{ fontSize: '0.7rem', opacity: 0.6, border: '1px solid #444' }}
            >
                Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
