import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import LeftNav from './layout/LeftNav/LeftNav';
import DiscoverPage from './discover/DiscoverPage';
import UserProfile from './profile/UserProfile';
import FeedPage from './feed/FeedPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <LeftNav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
