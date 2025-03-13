-- Luo tietokanta
CREATE DATABASE TechScannerDB;
GO

USE TechScannerDB;
GO

-- Luo Projects-taulu
CREATE TABLE Projects (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    LastScanned DATETIME NOT NULL
);

-- Luo Repositories-taulu
CREATE TABLE Repositories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Url NVARCHAR(500) NULL,
    ProjectId INT NOT NULL,
    CONSTRAINT FK_Repositories_Projects FOREIGN KEY (ProjectId) REFERENCES Projects(Id)
);

-- Luo Technologies-taulu
CREATE TABLE Technologies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Version NVARCHAR(100) NOT NULL,
    Type NVARCHAR(100) NOT NULL,
    RepositoryId INT NOT NULL,
    DetectedDate DATETIME NOT NULL,
    SourceFile NVARCHAR(500) NOT NULL,
    CONSTRAINT FK_Technologies_Repositories FOREIGN KEY (RepositoryId) REFERENCES Repositories(Id)
);

-- Luo indeksit hakujen optimointiin
CREATE INDEX IX_Projects_Name ON Projects(Name);
CREATE INDEX IX_Repositories_ProjectId ON Repositories(ProjectId);
CREATE INDEX IX_Technologies_RepositoryId ON Technologies(RepositoryId);
CREATE INDEX IX_Technologies_Name ON Technologies(Name);
CREATE INDEX IX_Technologies_Version ON Technologies(Version);
CREATE INDEX IX_Technologies_Type ON Technologies(Type);

-- Luo näkymä teknologioiden hakuun
CREATE VIEW vw_TechnologiesWithProjects AS
SELECT 
    t.Id,
    t.Name,
    t.Version,
    t.Type,
    t.DetectedDate,
    t.SourceFile,
    r.Id AS RepositoryId,
    r.Name AS RepositoryName,
    p.Id AS ProjectId,
    p.Name AS ProjectName
FROM 
    Technologies t
    INNER JOIN Repositories r ON t.RepositoryId = r.Id
    INNER JOIN Projects p ON r.ProjectId = p.Id;
GO 