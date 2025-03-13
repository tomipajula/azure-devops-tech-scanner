import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Azure DevOps -teknologiaskanneri | '}
          <Link color="inherit" href="https://github.com/your-organization/devops-tech-scanner">
            GitHub
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 