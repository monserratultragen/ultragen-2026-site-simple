import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Wall from './components/Wall';
import Landing from './components/Landing';
import Guestbook from './components/Guestbook';
import LoadingScreen from './components/LoadingScreen';
import WelcomeModal from './components/WelcomeModal';
import SupportButton from './components/SupportButton';
import SupportModal from './components/SupportModal';
const BackupsPage = React.lazy(() => import('./components/BackupsPage'));
import './index.css';

const MainLayout = ({ chapters, guestbookEntries, onOpenSupportModal, onNavigate }) => (
  <div className="main-layout">
    <div className="content-column">
      <Wall
        chapters={chapters}
        onOpenSupportModal={onOpenSupportModal}
        onNavigate={onNavigate}
      />
    </div>
    <div className="guestbook-column">
      <Guestbook entries={guestbookEntries} />
    </div>
  </div>
);

const AppContent = ({ chapters, guestbookEntries, user, onLogout, onOpenSupportModal }) => {
  const navigate = useNavigate();

  return (
    <>
      <Header onLogout={onLogout} />

      <Routes>
        <Route path="/" element={
          <MainLayout
            chapters={chapters}
            guestbookEntries={guestbookEntries}
            onOpenSupportModal={onOpenSupportModal}
            onNavigate={(page) => page === 'backups' ? navigate('/backups') : navigate('/')}
          />
        } />

        <Route path="/backups" element={
          <React.Suspense fallback={<LoadingScreen progress={100} />}>
            {sessionStorage.getItem('master_unlocked') === 'true' ? (
              <BackupsPage
                chapters={chapters}
                onNavigate={(page) => page === 'home' ? navigate('/') : navigate('/backups')}
              />
            ) : (
              <Navigate to="/" replace />
            )}
          </React.Suspense>
        } />

        {/* Deep link route for chapters */}
        <Route path="/:diarioId/:tomoId/:chapterId" element={
          <MainLayout
            chapters={chapters}
            guestbookEntries={guestbookEntries}
            onOpenSupportModal={onOpenSupportModal}
            onNavigate={(page) => page === 'backups' ? navigate('/backups') : navigate('/')}
          />
        } />
      </Routes>

      <SupportButton onOpenModal={onOpenSupportModal} />
    </>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ultragen_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Smooth Progress Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= targetProgress) return prev;
        const diff = targetProgress - prev;
        const step = Math.ceil(diff / 5);
        return prev + step;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [targetProgress]);

  // Simulated Progress Effect
  useEffect(() => {
    if (!dataLoading) return;
    const interval = setInterval(() => {
      setTargetProgress(prev => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 3;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [dataLoading]);

  // Completion Effect
  useEffect(() => {
    if (loadProgress >= 100) {
      const timeout = setTimeout(() => {
        setDataLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [loadProgress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTargetProgress(10);
        const chaptersPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/capitulos/`)
          .then(res => {
            const sorted = res.data.sort((a, b) =>
              (a.diario_orden - b.diario_orden) ||
              (a.tomo_orden - b.tomo_orden) ||
              (a.tomo_id - b.tomo_id) ||
              (a.orden - b.orden) ||
              (a.id - b.id)
            );
            setChapters(sorted);
            setTargetProgress(prev => Math.min(prev + 10, 90));
          });

        const guestbookPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/libro-visitas/`)
          .then(res => {
            const sorted = res.data.sort((a, b) => b.id - a.id);
            setGuestbookEntries(sorted);
            setTargetProgress(prev => Math.min(prev + 5, 90));
          });

        await Promise.all([chaptersPromise, guestbookPromise]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setTargetProgress(100);
      }
    };
    fetchData();
  }, []);

  const handleGuestLogin = (guestUser) => {
    setUser(guestUser);
    localStorage.setItem('ultragen_user', JSON.stringify(guestUser));
    setShowWelcomeModal(true);
  };

  const handleWelcomeAccept = () => {
    setShowWelcomeModal(false);
  };

  const handleWelcomeCancel = () => {
    setUser(null);
    localStorage.removeItem('ultragen_user');
    setShowWelcomeModal(false);
  };

  if (!user) {
    return <Landing onLogin={handleGuestLogin} />;
  }

  return (
    <HashRouter>
      <div className="App">
        {!dataLoading && (
          <AppContent
            chapters={chapters}
            guestbookEntries={guestbookEntries}
            user={user}
            onLogout={() => {
              setUser(null);
              localStorage.removeItem('ultragen_user');
            }}
            onOpenSupportModal={() => setShowSupportModal(true)}
          />
        )}

        {dataLoading && <LoadingScreen progress={loadProgress} />}

        {showWelcomeModal && (
          <WelcomeModal
            onAccept={handleWelcomeAccept}
            onCancel={handleWelcomeCancel}
          />
        )}

        {showSupportModal && (
          <SupportModal onClose={() => setShowSupportModal(false)} />
        )}
      </div>
    </HashRouter>
  );
}

export default App;
