import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Wall from './components/Wall';
import Landing from './components/Landing';
import Guestbook from './components/Guestbook';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating auth check or just finishing loading immediately
    setLoading(false);
  }, []);

  if (loading) return <div className="loading-screen">Cargando...</div>;

  if (!user) {
    return <Landing onLogin={setUser} />;
  }

  return (
    <div className="App">
      <Header />
      <div className="main-layout">
        <div className="content-column">
          <Wall />
        </div>
        <div className="guestbook-column">
          <Guestbook />
        </div>
      </div>
    </div>
  );
}

export default App;
