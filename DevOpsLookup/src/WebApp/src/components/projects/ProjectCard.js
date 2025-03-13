import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate, truncateText } from '../../utils/helpers';

const ProjectCard = ({ project, repositoryCount = 0 }) => {
  const { id, name, description, lastScanned } = project;

  return (
    <Card className="card-hover">
      <CardActionArea component={RouterLink} to={`/projects/${id}`}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {name}
            </Typography>
            <Chip 
              label={`${repositoryCount} ${repositoryCount === 1 ? 'repositorio' : 'repositoriota'}`} 
              size="small" 
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
            {truncateText(description, 100)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Viimeisin skannaus: {formatDate(lastScanned)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard; 