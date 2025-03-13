import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box, Chip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GitHub as GitHubIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';

const RepositoryCard = ({ repository, technologyCount = 0 }) => {
  const { id, name, url } = repository;

  return (
    <Card className="card-hover">
      <CardActionArea component={RouterLink} to={`/repositories/${id}`}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6" component="h3">
                {name}
              </Typography>
            </Box>
            <Chip 
              label={`${technologyCount} ${technologyCount === 1 ? 'teknologia' : 'teknologiaa'}`} 
              size="small" 
              color="secondary"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Link 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <OpenInNewIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" noWrap>
                {url}
              </Typography>
            </Link>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RepositoryCard; 