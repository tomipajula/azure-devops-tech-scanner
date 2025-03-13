import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  TextField, 
  InputAdornment,
  Box
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ProjectCard from '../components/projects/ProjectCard';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import apiService from '../services/api';
import { projects, repositories } from '../services/mockData'; // Mockdata kehitystä varten

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Kommentoi tämä pois ja käytä alla olevaa riviä, kun backend on valmis
        setProjectsData(projects);
        // const response = await apiService.getProjects();
        // setProjectsData(response);
        setError(null);
      } catch (err) {
        console.error('Virhe projektien haussa:', err);
        setError('Projektien haku epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjects(projectsData);
    } else {
      const filtered = projectsData.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projectsData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simuloi uutta hakua
    setTimeout(() => {
      setProjectsData(projects);
      setLoading(false);
    }, 1000);
  };

  // Laske repositorioiden määrä kullekin projektille
  const getRepositoryCount = (projectId) => {
    return repositories.filter(repo => repo.projectId === projectId).length;
  };

  if (loading) {
    return <LoadingIndicator message="Ladataan projekteja..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader title="Projektit" />
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Etsi projekteja..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {filteredProjects.length === 0 ? (
        <EmptyState 
          title="Ei projekteja" 
          message={searchTerm ? "Hakuehdoilla ei löytynyt projekteja." : "Ei näytettäviä projekteja."}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <ProjectCard 
                project={project} 
                repositoryCount={getRepositoryCount(project.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Projects; 