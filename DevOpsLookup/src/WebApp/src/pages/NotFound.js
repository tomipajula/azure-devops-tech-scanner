import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import EmptyState from '../components/common/EmptyState';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '4rem', md: '6rem' } }}>
        404
      </Typography>
      
      <EmptyState 
        title="Sivua ei löytynyt"
        message="Hakemaasi sivua ei löytynyt. Se on saatettu poistaa tai osoite on virheellinen."
        action={() => {}}
        actionText=""
      />
      
      <Box sx={{ mt: 4 }}>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
        >
          Takaisin etusivulle
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 