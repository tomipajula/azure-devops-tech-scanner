import React from 'react';
import { Box, Alert, AlertTitle, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorMessage = ({ 
  title = 'Virhe', 
  message = 'Tapahtui virhe. Yritä uudelleen.', 
  onRetry 
}) => {
  return (
    <Box sx={{ my: 4 }}>
      <Alert 
        severity="error"
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Yritä uudelleen
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage; 