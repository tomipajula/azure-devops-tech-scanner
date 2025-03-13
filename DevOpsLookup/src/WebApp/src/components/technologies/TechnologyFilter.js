import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Grid,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const TechnologyFilter = ({ 
  filters, 
  setFilters, 
  availableTypes = [], 
  onSearch,
  onClear
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({
      name: '',
      version: '',
      type: ''
    });
    if (onClear) onClear();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: 'background.paper', 
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Teknologian nimi"
            name="name"
            value={filters.name}
            onChange={handleChange}
            variant="outlined"
            placeholder="Esim. React, Node.js"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Versio"
            name="version"
            value={filters.version}
            onChange={handleChange}
            variant="outlined"
            placeholder="Esim. 18.2.0"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="type-select-label">Tyyppi</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              name="type"
              value={filters.type}
              onChange={handleChange}
              label="Tyyppi"
            >
              <MenuItem value="">Kaikki</MenuItem>
              {availableTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ flex: 1 }}
          >
            Hae
          </Button>
          <Button 
            type="button" 
            variant="outlined" 
            onClick={handleClear}
            startIcon={<ClearIcon />}
            sx={{ flex: 1, minWidth: '120px' }}
          >
            Tyhjennä
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TechnologyFilter;
