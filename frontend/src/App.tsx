import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { royalBlue } from './theme/royalBlue';
import MainLayout from './layout/MainLayout';
import LogoCentered from './layout/SplashScreen/LogoCentered';
import FeedPage from './feed/FeedPage';
import DiscoverPage from './discover/DiscoverPage';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={royalBlue}>
        <LogoCentered />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={royalBlue}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            {/* Add other routes here */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
