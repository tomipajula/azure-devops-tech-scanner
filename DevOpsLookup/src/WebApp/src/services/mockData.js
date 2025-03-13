// Mockdata kehitystä varten, kun backend ei ole vielä käytettävissä

export const projects = [
  { id: 1, name: 'Verkkokauppa', description: 'Verkkokauppasovellus', lastScanned: '2023-03-10T10:30:00' },
  { id: 2, name: 'Mobiilisovellus', description: 'Mobiilisovellus asiakkaille', lastScanned: '2023-03-09T14:15:00' },
  { id: 3, name: 'Intranet', description: 'Yrityksen sisäinen intranet', lastScanned: '2023-03-08T09:45:00' },
  { id: 4, name: 'API Gateway', description: 'API Gateway -palvelu', lastScanned: '2023-03-07T16:20:00' },
  { id: 5, name: 'Hallintapaneeli', description: 'Järjestelmän hallintapaneeli', lastScanned: '2023-03-06T11:10:00' },
];

export const repositories = [
  { id: 1, name: 'verkkokauppa-frontend', url: 'https://dev.azure.com/org/verkkokauppa-frontend', projectId: 1 },
  { id: 2, name: 'verkkokauppa-backend', url: 'https://dev.azure.com/org/verkkokauppa-backend', projectId: 1 },
  { id: 3, name: 'verkkokauppa-api', url: 'https://dev.azure.com/org/verkkokauppa-api', projectId: 1 },
  { id: 4, name: 'mobiili-app', url: 'https://dev.azure.com/org/mobiili-app', projectId: 2 },
  { id: 5, name: 'mobiili-backend', url: 'https://dev.azure.com/org/mobiili-backend', projectId: 2 },
  { id: 6, name: 'intranet-portal', url: 'https://dev.azure.com/org/intranet-portal', projectId: 3 },
  { id: 7, name: 'api-gateway', url: 'https://dev.azure.com/org/api-gateway', projectId: 4 },
  { id: 8, name: 'admin-panel', url: 'https://dev.azure.com/org/admin-panel', projectId: 5 },
];

export const technologies = [
  { id: 1, name: 'React', version: '18.2.0', type: 'Frontend', repositoryId: 1, detectedDate: '2023-03-10T10:30:00', sourceFile: 'package.json' },
  { id: 2, name: 'TypeScript', version: '4.9.5', type: 'Frontend', repositoryId: 1, detectedDate: '2023-03-10T10:30:00', sourceFile: 'package.json' },
  { id: 3, name: 'Material UI', version: '5.11.12', type: 'Frontend', repositoryId: 1, detectedDate: '2023-03-10T10:30:00', sourceFile: 'package.json' },
  { id: 4, name: 'Node.js', version: '18.14.2', type: 'Backend', repositoryId: 2, detectedDate: '2023-03-10T10:30:00', sourceFile: 'package.json' },
  { id: 5, name: 'Express', version: '4.18.2', type: 'Backend', repositoryId: 2, detectedDate: '2023-03-10T10:30:00', sourceFile: 'package.json' },
  { id: 6, name: 'MongoDB', version: '6.0.4', type: 'Database', repositoryId: 2, detectedDate: '2023-03-10T10:30:00', sourceFile: 'docker-compose.yml' },
  { id: 7, name: '.NET Core', version: '6.0.14', type: 'Backend', repositoryId: 3, detectedDate: '2023-03-10T10:30:00', sourceFile: 'Verkkokauppa.Api.csproj' },
  { id: 8, name: 'Entity Framework', version: '6.0.14', type: 'ORM', repositoryId: 3, detectedDate: '2023-03-10T10:30:00', sourceFile: 'Verkkokauppa.Api.csproj' },
  { id: 9, name: 'SQL Server', version: '2019', type: 'Database', repositoryId: 3, detectedDate: '2023-03-10T10:30:00', sourceFile: 'docker-compose.yml' },
  { id: 10, name: 'React Native', version: '0.71.3', type: 'Mobile', repositoryId: 4, detectedDate: '2023-03-09T14:15:00', sourceFile: 'package.json' },
  { id: 11, name: 'TypeScript', version: '4.9.5', type: 'Mobile', repositoryId: 4, detectedDate: '2023-03-09T14:15:00', sourceFile: 'package.json' },
  { id: 12, name: 'Node.js', version: '18.14.2', type: 'Backend', repositoryId: 5, detectedDate: '2023-03-09T14:15:00', sourceFile: 'package.json' },
  { id: 13, name: 'Express', version: '4.18.2', type: 'Backend', repositoryId: 5, detectedDate: '2023-03-09T14:15:00', sourceFile: 'package.json' },
  { id: 14, name: 'PostgreSQL', version: '15.2', type: 'Database', repositoryId: 5, detectedDate: '2023-03-09T14:15:00', sourceFile: 'docker-compose.yml' },
  { id: 15, name: 'Angular', version: '15.2.0', type: 'Frontend', repositoryId: 6, detectedDate: '2023-03-08T09:45:00', sourceFile: 'package.json' },
  { id: 16, name: 'TypeScript', version: '4.9.5', type: 'Frontend', repositoryId: 6, detectedDate: '2023-03-08T09:45:00', sourceFile: 'package.json' },
  { id: 17, name: 'Spring Boot', version: '3.0.4', type: 'Backend', repositoryId: 7, detectedDate: '2023-03-07T16:20:00', sourceFile: 'pom.xml' },
  { id: 18, name: 'Java', version: '17.0.6', type: 'Backend', repositoryId: 7, detectedDate: '2023-03-07T16:20:00', sourceFile: 'pom.xml' },
  { id: 19, name: 'Vue.js', version: '3.2.47', type: 'Frontend', repositoryId: 8, detectedDate: '2023-03-06T11:10:00', sourceFile: 'package.json' },
  { id: 20, name: 'TypeScript', version: '4.9.5', type: 'Frontend', repositoryId: 8, detectedDate: '2023-03-06T11:10:00', sourceFile: 'package.json' },
];

export const dashboardData = {
  totalProjects: 5,
  totalRepositories: 8,
  totalTechnologies: 20,
  recentScans: [
    { id: 1, projectName: 'Verkkokauppa', scanDate: '2023-03-10T10:30:00', technologiesFound: 9 },
    { id: 2, projectName: 'Mobiilisovellus', scanDate: '2023-03-09T14:15:00', technologiesFound: 5 },
    { id: 3, projectName: 'Intranet', scanDate: '2023-03-08T09:45:00', technologiesFound: 2 },
  ],
  popularTechnologies: [
    { name: 'TypeScript', count: 4, versions: ['4.9.5'] },
    { name: 'Node.js', count: 2, versions: ['18.14.2'] },
    { name: 'Express', count: 2, versions: ['4.18.2'] },
    { name: 'React', count: 1, versions: ['18.2.0'] },
    { name: 'Angular', count: 1, versions: ['15.2.0'] },
  ],
  technologiesByType: [
    { type: 'Frontend', count: 7 },
    { type: 'Backend', count: 7 },
    { type: 'Database', count: 3 },
    { type: 'Mobile', count: 2 },
    { type: 'ORM', count: 1 },
  ],
}; 