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
  Link,
  Chip,
  Tab,
  Tabs
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  GitHub as GitHubIcon,
  OpenInNew as OpenInNewIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import TechnologyCard from '../components/technologies/TechnologyCard';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import apiService from '../services/api';
import { formatDate } from '../utils/helpers';
import { repositories, projects, technologies } from '../services/mockData'; // Mockdata kehitystä varten

const RepositoryDetail = () => {
  const { repositoryId } = useParams();
  const [repository, setRepository] = useState(null);
  const [project, setProject] = useState(null);
  const [repositoryTechnologies, setRepositoryTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      try {
        setLoading(true);
        // Kommentoi tämä pois ja käytä alla olevia rivejä, kun backend on valmis
        const repositoryData = repositories.find(r => r.id === parseInt(repositoryId));
        
        if (repositoryData) {
          const projectData = projects.find(p => p.id === repositoryData.projectId);
          const repoTechnologies = technologies.filter(tech => tech.repositoryId === parseInt(repositoryId));
          
          setRepository(repositoryData);
          setProject(projectData);
          setRepositoryTechnologies(repoTechnologies);
          setFilteredTechnologies(repoTechnologies);
        }
        
        // const repositoryData = await apiService.getRepository(repositoryId);
        // setRepository(repositoryData);
        
        // const projectData = await apiService.getProject(repositoryData.projectId);
        // setProject(projectData);
        
        // const repoTechnologies = await apiService.getRepositoryTechnologies(repositoryId);
        // setRepositoryTechnologies(repoTechnologies);
        // setFilteredTechnologies(repoTechnologies);
        
        setError(null);
      } catch (err) {
        console.error(`Virhe repositorion ${repositoryId} tietojen haussa:`, err);
        setError('Repositorion tietojen haku epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositoryDetails();
  }, [repositoryId]);

  useEffect(() => {
    if (activeTab === 0) {
      setFilteredTechnologies(repositoryTechnologies);
    } else {
      const types = ['Frontend', 'Backend', 'Database', 'Mobile', 'ORM'];
      const selectedType = types[activeTab - 1];
      setFilteredTechnologies(
        repositoryTechnologies.filter(tech => tech.type === selectedType)
      );
    }
  }, [activeTab, repositoryTechnologies]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simuloi uutta hakua
    setTimeout(() => {
      const repositoryData = repositories.find(r => r.id === parseInt(repositoryId));
      
      if (repositoryData) {
        const projectData = projects.find(p => p.id === repositoryData.projectId);
        const repoTechnologies = technologies.filter(tech => tech.repositoryId === parseInt(repositoryId));
        
        setRepository(repositoryData);
        setProject(projectData);
        setRepositoryTechnologies(repoTechnologies);
        setFilteredTechnologies(repoTechnologies);
      }
      setLoading(false);
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <LoadingIndicator message="Ladataan repositorion tietoja..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!repository || !project) {
    return (
      <Container maxWidth="xl">
        <PageHeader 
          title="Repositoriota ei löytynyt" 
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
          title="Repositoriota ei löytynyt" 
          message="Haettua repositoriota ei löytynyt. Se on saatettu poistaa."
          action={() => window.history.back()}
          actionText="Takaisin"
        />
      </Container>
    );
  }

  // Teknologiatyypit välilehtiin
  const tabs = [
    { label: 'Kaikki', count: repositoryTechnologies.length },
    { label: 'Frontend', count: repositoryTechnologies.filter(t => t.type === 'Frontend').length },
    { label: 'Backend', count: repositoryTechnologies.filter(t => t.type === 'Backend').length },
    { label: 'Database', count: repositoryTechnologies.filter(t => t.type === 'Database').length },
    { label: 'Mobile', count: repositoryTechnologies.filter(t => t.type === 'Mobile').length },
    { label: 'ORM', count: repositoryTechnologies.filter(t => t.type === 'ORM').length },
  ];

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={repository.name} 
        breadcrumbs={[
          { label: 'Projektit', path: '/projects' },
          { label: project.name, path: `/projects/${project.id}` }
        ]}
        action={
          <Button 
            component={RouterLink} 
            to={`/projects/${project.id}`} 
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Takaisin projektiin
          </Button>
        }
      />
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">
              Repositorion tiedot
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                <strong>Projekti:</strong>{' '}
                <Link component={RouterLink} to={`/projects/${project.id}`}>
                  {project.name}
                </Link>
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Viimeisin skannaus:</strong> {formatDate(project.lastScanned)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CodeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="body1">
                  <strong>Teknologioita:</strong> {repositoryTechnologies.length}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  <strong>URL:</strong>
                </Typography>
                <Link 
                  href={repository.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <OpenInNewIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" noWrap>
                    {repository.url}
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Teknologiat ({repositoryTechnologies.length})
        </Typography>
        <Divider />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tab.label}
                  {tab.count > 0 && (
                    <Chip 
                      label={tab.count} 
                      size="small" 
                      sx={{ ml: 1, height: 20, minWidth: 20 }}
                      color={activeTab === index ? 'primary' : 'default'}
                    />
                  )}
                </Box>
              } 
              disabled={tab.count === 0}
            />
          ))}
        </Tabs>
      </Box>
      
      {filteredTechnologies.length === 0 ? (
        <EmptyState 
          title="Ei teknologioita" 
          message={activeTab === 0 
            ? "Tästä repositoriosta ei löytynyt teknologioita." 
            : `Tästä repositoriosta ei löytynyt ${tabs[activeTab].label}-tyypin teknologioita.`
          }
          icon={CodeIcon}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredTechnologies.map((technology) => (
            <Grid item key={technology.id} xs={12} sm={6} md={4}>
              <TechnologyCard technology={technology} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RepositoryDetail; 