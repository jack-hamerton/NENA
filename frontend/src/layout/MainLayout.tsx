import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import LeftNav from './LeftNav';
import ScreenshotBlocker from './ScreenshotBlocker';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <ScreenshotBlocker />
      <LeftNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
