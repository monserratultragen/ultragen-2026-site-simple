import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Wall from './components/Wall';
import Landing from './components/Landing';
import Guestbook from './components/Guestbook';
import LoadingScreen from './components/LoadingScreen';
import WelcomeModal from './components/WelcomeModal';
import SupportButton from './components/SupportButton';
import './index.css';

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

  // Smooth Progress Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= targetProgress) return prev;
        const diff = targetProgress - prev;
        // Divide by a factor for smoothing (e.g., 5). Minimum step 1 to ensure parsing finish.
        const step = Math.ceil(diff / 5);
        return prev + step;
      });
    }, 40); // 25fps update

    return () => clearInterval(timer);
  }, [targetProgress]);

  // Simulated Progress (Fake Loading) Effect
  // Slowly advances targetProgress up to 85% while dataLoading is true
  useEffect(() => {
    if (!dataLoading) return;

    const interval = setInterval(() => {
      setTargetProgress(prev => {
        // Stop auto-incrementing at 85%
        if (prev >= 85) return prev;
        // Add small random increment (0-3%)
        return prev + Math.random() * 3;
      });
    }, 800); // Update every 800ms

    return () => clearInterval(interval);
  }, [dataLoading]);

  // Completion Effect
  useEffect(() => {
    if (loadProgress >= 100) {
      // Small delay to ensure user sees 100%
      const timeout = setTimeout(() => {
        setDataLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [loadProgress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTargetProgress(10); // Initial target

        // Helper to safely update target
        const addToTarget = (amount) => {
          setTargetProgress(prev => Math.min(prev + amount, 100));
        };

        const chaptersPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/capitulos/`)
          .then(res => {
            // Sort by orden (asc) then id (desc)
            const sorted = res.data.sort((a, b) => (a.orden - b.orden) || (b.id - a.id));
            setChapters(sorted);
            setTargetProgress(prev => Math.min(prev + 10, 90));
          });

        const guestbookPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/libro-visitas/`)
          .then(res => {
            // Newest comments first
            const sorted = res.data.sort((a, b) => b.id - a.id);
            setGuestbookEntries(sorted);
            setTargetProgress(prev => Math.min(prev + 5, 90));
          });

        await Promise.all([chaptersPromise, guestbookPromise]);

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        // Instead of hiding immediately, we ensure target goes to 100
        // The effects will handle the rest (smoothing -> 100 -> hide)
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

  // Show loading screen if data is loading OR if welcome modal is showing (background context)
  // Actually, requested behavior: "while modal is there, loading happens".
  // If user accepts, they see loading screen if not done.
  // So structure:
  // Layer 1 (Bottom): Content (Wall/Guestbook) - Hidden if loading? Or just empty? 
  //                   Ideally we don't render Wall until data is ready to avoid flicker, 
  //                   BUT if we want "loading happens in background", we just hold the render of content until loading done.

  // Layer 2 (Middle): Loading Screen - Visible if dataLoading is true.
  // Layer 3 (Top): Welcome Modal - Visible if showWelcomeModal is true.

  return (
    <div className="App">
      {/* Background Content - Only render if we have data to avoid crashes/empty states, 
          or render but it's covered by loading screen anyway. */}
      {!dataLoading && (
        <>
          <Header onLogout={() => {
            setUser(null);
            localStorage.removeItem('ultragen_user');
          }} />
          <div className="main-layout">
            <div className="content-column">
              <Wall chapters={chapters} />
            </div>
            <div className="guestbook-column">
              <Guestbook entries={guestbookEntries} />
            </div>
          </div>
          <SupportButton />
        </>
      )}

      {/* Loading Screen Overlay */}
      {dataLoading && (
        <LoadingScreen progress={loadProgress} />
      )}

      {/* Welcome Modal Overlay */}
      {showWelcomeModal && (
        <WelcomeModal
          onAccept={handleWelcomeAccept}
          onCancel={handleWelcomeCancel}
        />
      )}
    </div>
  );
}

export default App;
