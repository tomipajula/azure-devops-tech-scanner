import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import RepositoryDetail from './pages/RepositoryDetail';
import TechnologySearch from './pages/TechnologySearch';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Box className="app-container">
      <Header />
      <Box className="content-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/repositories/:repositoryId" element={<RepositoryDetail />} />
          <Route path="/technologies" element={<TechnologySearch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App; 