import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { formatDate } from '../../utils/helpers';

const RecentScansTable = ({ scans = [] }) => {
  if (!scans.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Ei viimeaikaisia skannauksia.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table aria-label="viimeisimmät skannaukset">
        <TableHead sx={{ backgroundColor: 'background.default' }}>
          <TableRow>
            <TableCell>Projekti</TableCell>
            <TableCell>Skannausaika</TableCell>
            <TableCell align="right">Löydetyt teknologiat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scans.map((scan) => (
            <TableRow 
              key={scan.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body1" fontWeight="medium">
                  {scan.projectName}
                </Typography>
              </TableCell>
              <TableCell>{formatDate(scan.scanDate)}</TableCell>
              <TableCell align="right">
                <Chip 
                  label={scan.technologiesFound} 
                  color="primary" 
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentScansTable; 