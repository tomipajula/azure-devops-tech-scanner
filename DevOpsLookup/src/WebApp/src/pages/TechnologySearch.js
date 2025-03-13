import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Divider,
  Pagination
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import TechnologyFilter from '../components/technologies/TechnologyFilter';
import TechnologyCard from '../components/technologies/TechnologyCard';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import apiService from '../services/api';
import { highlightSearchTerm, getUniqueTechnologyTypes } from '../utils/helpers';
import { technologies, repositories, projects } from '../services/mockData'; // Mockdata kehitystä varten

const TechnologySearch = () => {
  const [allTechnologies, setAllTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    version: '',
    type: ''
  });
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [availableTypes, setAvailableTypes] = useState([]);
  const itemsPerPage = 9;

  // Haetaan projekti- ja repositoriotiedot
  const [projectsData, setProjectsData] = useState([]);
  const [repositoriesData, setRepositoriesData] = useState([]);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        // Kommentoi tämä pois ja käytä alla olevaa riviä, kun backend on valmis
        const techData = technologies;
        setAllTechnologies(techData);
        setFilteredTechnologies(techData);
        setAvailableTypes(getUniqueTechnologyTypes(techData));
        
        // Haetaan myös projektit ja repositoriot
        setProjectsData(projects);
        setRepositoriesData(repositories);
        
        // const response = await apiService.searchTechnologies({});
        // setAllTechnologies(response);
        // setFilteredTechnologies(response);
        // setAvailableTypes(getUniqueTechnologyTypes(response));
        
        // const projectsResponse = await apiService.getProjects();
        // setProjectsData(projectsResponse);
        
        // const reposResponse = await apiService.getAllRepositories();
        // setRepositoriesData(reposResponse);
        
        setError(null);
      } catch (err) {
        console.error('Virhe teknologioiden haussa:', err);
        setError('Teknologioiden haku epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const handleSearch = async () => {
    try {
      setSearching(true);
      
      // Kommentoi tämä pois ja käytä alla olevaa riviä, kun backend on valmis
      const filtered = allTechnologies.filter(tech => {
        const nameMatch = filters.name ? tech.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
        const versionMatch = filters.version ? tech.version.toLowerCase().includes(filters.version.toLowerCase()) : true;
        const typeMatch = filters.type ? tech.type === filters.type : true;
        return nameMatch && versionMatch && typeMatch;
      });
      
      setFilteredTechnologies(filtered);
      setPage(1);
      
      // const response = await apiService.searchTechnologies(filters);
      // setFilteredTechnologies(response);
      // setPage(1);
      
      setError(null);
    } catch (err) {
      console.error('Virhe teknologioiden haussa:', err);
      setError('Teknologioiden haku epäonnistui. Yritä myöhemmin uudelleen.');
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setFilteredTechnologies(allTechnologies);
    setPage(1);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simuloi uutta hakua
    setTimeout(() => {
      setAllTechnologies(technologies);
      setFilteredTechnologies(technologies);
      setAvailableTypes(getUniqueTechnologyTypes(technologies));
      setProjectsData(projects);
      setRepositoriesData(repositories);
      setLoading(false);
    }, 1000);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hakee projektin ja repositorion tiedot teknologialle
  const getProjectAndRepositoryInfo = (technology) => {
    const repository = repositoriesData.find(repo => repo.id === technology.repositoryId);
    if (!repository) return { projectInfo: null, repositoryInfo: null };
    
    const project = projectsData.find(proj => proj.id === repository.projectId);
    return {
      projectInfo: project || null,
      repositoryInfo: repository
    };
  };

  // Sivutus
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTechnologies = filteredTechnologies.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredTechnologies.length / itemsPerPage);

  if (loading) {
    return <LoadingIndicator message="Ladataan teknologioita..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  const isFiltered = filters.name || filters.version || filters.type;

  return (
    <Container maxWidth="xl">
      <PageHeader title="Teknologiahaku" />
      
      <TechnologyFilter 
        filters={filters}
        setFilters={setFilters}
        availableTypes={availableTypes}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Hakutulokset {filteredTechnologies.length > 0 && `(${filteredTechnologies.length})`}
        </Typography>
        <Divider />
      </Box>
      
      {searching ? (
        <LoadingIndicator message="Haetaan teknologioita..." />
      ) : filteredTechnologies.length === 0 ? (
        <EmptyState 
          title="Ei hakutuloksia" 
          message={isFiltered 
            ? "Hakuehdoilla ei löytynyt teknologioita. Kokeile muuttaa hakuehtoja." 
            : "Ei näytettäviä teknologioita."
          }
        />
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {paginatedTechnologies.map((technology) => {
              const { projectInfo, repositoryInfo } = getProjectAndRepositoryInfo(technology);
              return (
                <Grid item key={technology.id} xs={12} sm={6} md={4}>
                  <TechnologyCard 
                    technology={technology} 
                    searchTerm={filters.name || filters.version}
                    highlightSearchTerm={highlightSearchTerm}
                    projectInfo={projectInfo}
                    repositoryInfo={repositoryInfo}
                  />
                </Grid>
              );
            })}
          </Grid>
          
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination 
                count={pageCount} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default TechnologySearch; 