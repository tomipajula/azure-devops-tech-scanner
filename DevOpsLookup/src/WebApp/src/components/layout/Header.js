import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Folder as ProjectsIcon,
  Code as TechnologiesIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import apiService from '../../services/api';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleScanClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmScan = async () => {
    setConfirmDialogOpen(false);
    try {
      setScanning(true);
      await apiService.triggerScan();
      alert('Skannaus käynnistetty onnistuneesti!');
    } catch (error) {
      console.error('Virhe skannauksen käynnistyksessä:', error);
      alert('Skannauksen käynnistys epäonnistui. Tarkista konsolista lisätietoja.');
    } finally {
      setScanning(false);
    }
  };

  const handleCancelScan = () => {
    setConfirmDialogOpen(false);
  };

  const navItems = [
    { text: 'Kojelauta', path: '/', icon: <DashboardIcon /> },
    { text: 'Projektit', path: '/projects', icon: <ProjectsIcon /> },
    { text: 'Teknologiat', path: '/technologies', icon: <TechnologiesIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Azure DevOps -teknologiaskanneri
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Azure DevOps -teknologiaskanneri
            </Typography>
            {!isMobile && (
              <Box sx={{ display: 'flex' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    sx={{ 
                      color: 'white',
                      mx: 1,
                      fontWeight: location.pathname === item.path ? 700 : 400,
                      borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
            <Tooltip title="Käynnistä skannaus">
              <IconButton 
                color="inherit" 
                onClick={handleScanClick}
                disabled={scanning}
                sx={{ ml: 2 }}
              >
                <RefreshIcon sx={{ animation: scanning ? 'spin 2s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Varmistusikkuna skannaukselle */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelScan}
        aria-labelledby="scan-confirmation-dialog-title"
        aria-describedby="scan-confirmation-dialog-description"
      >
        <DialogTitle id="scan-confirmation-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Vahvista skannauksen käynnistys
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="scan-confirmation-dialog-description">
            Oletko varma, että haluat käynnistää teknologiaskannauksen? Tämä toiminto skannaa kaikki Azure DevOps -repositoriot uudelleen.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'warning.main', fontWeight: 'bold' }}>
            Huomio: Skannauksen käynnistäminen lisää Azure-resurssien käyttöä ja voi aiheuttaa lisäkustannuksia.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelScan} color="primary">
            Peruuta
          </Button>
          <Button onClick={handleConfirmScan} color="warning" variant="contained">
            Käynnistä skannaus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header; 