import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PageHeader = ({ title, breadcrumbs = [], action }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {action}
      </Box>
      
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link component={RouterLink} to="/" color="inherit">
            Etusivu
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <Link 
                key={index} 
                component={RouterLink} 
                to={crumb.path} 
                color="inherit"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Divider sx={{ mb: 3 }} />
    </Box>
  );
};

export default PageHeader; 