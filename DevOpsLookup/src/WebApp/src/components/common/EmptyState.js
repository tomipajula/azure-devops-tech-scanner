import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const EmptyState = ({ 
  title = 'Ei tuloksia', 
  message = 'Ei näytettäviä tietoja.', 
  icon: CustomIcon = SearchIcon,
  action,
  actionText = 'Toiminto'
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: 'background.default',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <CustomIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {action && (
        <Button 
          variant="contained" 
          onClick={action}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
