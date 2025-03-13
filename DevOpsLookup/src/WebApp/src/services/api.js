import axios from 'axios';

// API:n perus-URL, joka voidaan määrittää ympäristömuuttujalla
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Axios-instanssi API-kutsuja varten
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API-palvelut
const apiService = {
  // Projektit
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Virhe projektien haussa:', error);
      throw error;
    }
  },

  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Virhe projektin ${projectId} haussa:`, error);
      throw error;
    }
  },

  // Repositoriot
  getProjectRepositories: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/repositories`);
      return response.data;
    } catch (error) {
      console.error(`Virhe projektin ${projectId} repositorioiden haussa:`, error);
      throw error;
    }
  },

  getRepository: async (repositoryId) => {
    try {
      const response = await api.get(`/repositories/${repositoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Virhe repositorion ${repositoryId} haussa:`, error);
      throw error;
    }
  },

  // Teknologiat
  getRepositoryTechnologies: async (repositoryId) => {
    try {
      const response = await api.get(`/repositories/${repositoryId}/technologies`);
      return response.data;
    } catch (error) {
      console.error(`Virhe repositorion ${repositoryId} teknologioiden haussa:`, error);
      throw error;
    }
  },

  searchTechnologies: async (params) => {
    try {
      const response = await api.get('/technologies/search', { params });
      return response.data;
    } catch (error) {
      console.error('Virhe teknologioiden haussa:', error);
      throw error;
    }
  },

  // Kojelaudan tiedot
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Virhe kojelaudan tietojen haussa:', error);
      throw error;
    }
  },

  // Manuaalinen skannaus
  triggerScan: async () => {
    try {
      const response = await api.post('/scan');
      return response.data;
    } catch (error) {
      console.error('Virhe skannauksen käynnistyksessä:', error);
      throw error;
    }
  },
};

export default apiService; 