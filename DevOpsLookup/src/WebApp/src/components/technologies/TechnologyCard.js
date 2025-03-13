import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Tooltip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Folder as FolderIcon, Storage as StorageIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';

const TechnologyCard = ({ technology, searchTerm, highlightSearchTerm, projectInfo, repositoryInfo }) => {
  const { name, version, type, detectedDate, sourceFile, repositoryId } = technology;
  
  // Määritä väri teknologiatyypin mukaan
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'frontend':
        return 'primary';
      case 'backend':
        return 'secondary';
      case 'database':
        return 'success';
      case 'mobile':
        return 'info';
      case 'orm':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      className="card-hover"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {searchTerm ? highlightSearchTerm(name, searchTerm) : name}
          </Typography>
          <Chip 
            label={type} 
            size="small" 
            color={getTypeColor(type)}
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Versio: {searchTerm ? highlightSearchTerm(version, searchTerm) : version}
        </Typography>
        
        {/* Projekti- ja repositoriotiedot */}
        {projectInfo && repositoryInfo && (
          <Box sx={{ mt: 2, mb: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FolderIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                <strong>Projekti:</strong>{' '}
                <Link component={RouterLink} to={`/projects/${projectInfo.id}`} color="primary">
                  {projectInfo.name}
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StorageIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="body2" noWrap>
                <strong>Repositorio:</strong>{' '}
                <Link component={RouterLink} to={`/repositories/${repositoryInfo.id}`} color="secondary">
                  {repositoryInfo.name}
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Havaittu: {formatDate(detectedDate)}
          </Typography>
          <Tooltip title={sourceFile} arrow>
            <Typography variant="body2" color="text.secondary" noWrap>
              Lähde: {sourceFile}
            </Typography>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TechnologyCard; 