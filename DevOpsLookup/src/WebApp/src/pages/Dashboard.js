import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import {
  Folder as FolderIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import RecentScansTable from '../components/dashboard/RecentScansTable';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import apiService from '../services/api';
import { dashboardData } from '../services/mockData'; // Mockdata kehitystä varten

// Rekisteröi ChartJS-komponentit
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Kommentoi tämä pois ja käytä alla olevaa riviä, kun backend on valmis
        setData(dashboardData);
        // const response = await apiService.getDashboardData();
        // setData(response);
        setError(null);
      } catch (err) {
        console.error('Virhe kojelaudan tietojen haussa:', err);
        setError('Kojelaudan tietojen haku epäonnistui. Yritä myöhemmin uudelleen.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simuloi uutta hakua
    setTimeout(() => {
      setData(dashboardData);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return <LoadingIndicator message="Ladataan kojelaudan tietoja..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Teknologiatyyppien data piirakkakaaviota varten
  const typeChartData = {
    labels: data.technologiesByType.map(item => item.type),
    datasets: [
      {
        data: data.technologiesByType.map(item => item.count),
        backgroundColor: [
          '#0078d4', // primary
          '#2b88d8', // secondary
          '#107c10', // success
          '#00b7c3', // info
          '#ffaa44', // warning
        ],
        borderWidth: 1,
      },
    ],
  };

  // Suosituimmat teknologiat pylväskaaviota varten
  const popularChartData = {
    labels: data.popularTechnologies.map(tech => tech.name),
    datasets: [
      {
        label: 'Käyttömäärä',
        data: data.popularTechnologies.map(tech => tech.count),
        backgroundColor: '#0078d4',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Container maxWidth="xl">
      <PageHeader title="Kojelauta" />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Projektit" 
            value={data.totalProjects} 
            icon={FolderIcon} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Repositoriot" 
            value={data.totalRepositories} 
            icon={StorageIcon} 
            color="secondary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Teknologiat" 
            value={data.totalTechnologies} 
            icon={CodeIcon} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Skannaukset" 
            value={data.recentScans.length} 
            icon={TrendingUpIcon} 
            color="info" 
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Teknologiat tyypeittäin" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Pie data={typeChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Suosituimmat teknologiat" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={popularChartData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Viimeisimmät skannaukset" />
            <Divider />
            <CardContent>
              <RecentScansTable scans={data.recentScans} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 