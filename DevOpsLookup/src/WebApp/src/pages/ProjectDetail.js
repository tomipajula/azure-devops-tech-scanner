import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import RepositoryCard from '../components/projects/RepositoryCard';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import apiService from '../services/api';
import { formatDate } from '../utils/helpers';
import { projects, repositories, technologies } from '../services/mockData'; // Mockdata kehitystä varten

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [projectRepositories, setProjectRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // Kommentoi tämä pois ja käytä alla olevia rivejä, kun backend on valmis
        const projectData = projects.find(p => p.id === parseInt(projectId));
        const projectRepos = repositories.filter(repo => repo.projectId === parseInt(projectId));
        
        setProject(projectData);
        setProjectRepositories(projectRepos);
        
        // const projectData = await apiService.getProject(projectId);
        // setProject(projectData);
        
        // const projectRepos = await apiService.getProjectRepositories(projectId);
        // setProjectRepositories(projectRepos);
        
        setError(null);
      } catch (err) {
        console.error(`Virhe projektin ${projectId} tietojen haussa:`, err);
        setError('Projektin tietojen haku epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simuloi uutta hakua
    setTimeout(() => {
      const projectData = projects.find(p => p.id === parseInt(projectId));
      const projectRepos = repositories.filter(repo => repo.projectId === parseInt(projectId));
      
      setProject(projectData);
      setProjectRepositories(projectRepos);
      setLoading(false);
    }, 1000);
  };

  // Laske teknologioiden määrä kullekin repositoriolle
  const getTechnologyCount = (repositoryId) => {
    return technologies.filter(tech => tech.repositoryId === repositoryId).length;
  };

  if (loading) {
    return <LoadingIndicator message="Ladataan projektin tietoja..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!project) {
    return (
      <Container maxWidth="xl">
        <PageHeader 
          title="Projektia ei löytynyt" 
          breadcrumbs={[{ label: 'Projektit', path: '/projects' }]}
          action={
            <Button 
              component={RouterLink} 
              to="/projects" 
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              Takaisin projekteihin
            </Button>
          }
        />
        <EmptyState 
          title="Projektia ei löytynyt" 
          message="Haettua projektia ei löytynyt. Se on saatettu poistaa."
          action={() => window.history.back()}
          actionText="Takaisin"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={project.name} 
        breadcrumbs={[{ label: 'Projektit', path: '/projects' }]}
        action={
          <Button 
            component={RouterLink} 
            to="/projects" 
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Takaisin projekteihin
          </Button>
        }
      />
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Projektin tiedot
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Kuvaus:</strong> {project.description || 'Ei kuvausta'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Viimeisin skannaus:</strong> {formatDate(project.lastScanned)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>Repositorioita:</strong> {projectRepositories.length}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Repositoriot:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {projectRepositories.slice(0, 5).map(repo => (
                    <Chip 
                      key={repo.id}
                      label={repo.name}
                      component={RouterLink}
                      to={`/repositories/${repo.id}`}
                      clickable
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                  {projectRepositories.length > 5 && (
                    <Chip 
                      label={`+${projectRepositories.length - 5} lisää`}
                      color="default"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Repositoriot ({projectRepositories.length})
        </Typography>
        <Divider />
      </Box>
      
      {projectRepositories.length === 0 ? (
        <EmptyState 
          title="Ei repositorioita" 
          message="Tähän projektiin ei ole liitetty repositorioita."
          icon={StorageIcon}
        />
      ) : (
        <Grid container spacing={3}>
          {projectRepositories.map((repository) => (
            <Grid item key={repository.id} xs={12} sm={6} md={4}>
              <RepositoryCard 
                repository={repository} 
                technologyCount={getTechnologyCount(repository.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectDetail; 