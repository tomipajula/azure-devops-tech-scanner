import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  return (
    <Card 
      className="card-hover"
      sx={{ 
        height: '100%',
        borderTop: 3,
        borderColor: `${color}.main`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          {Icon && (
            <Box 
              sx={{ 
                backgroundColor: `${color}.lighter`,
                p: 1.5,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ fontSize: 40, color: `${color}.main` }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
