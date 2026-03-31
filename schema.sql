-- ============================================================
-- BloodLink Database Schema  (T-SQL / Microsoft SQL Server)
-- ============================================================

-- Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BloodLink')
BEGIN
    CREATE DATABASE BloodLink;
END
GO

USE BloodLink;
GO

-- ============================================================
-- Tables
-- ============================================================

IF OBJECT_ID('dbo.messages', 'U') IS NOT NULL DROP TABLE dbo.messages;
IF OBJECT_ID('dbo.volunteers', 'U') IS NOT NULL DROP TABLE dbo.volunteers;
IF OBJECT_ID('dbo.donors', 'U') IS NOT NULL DROP TABLE dbo.donors;
IF OBJECT_ID('dbo.posts', 'U') IS NOT NULL DROP TABLE dbo.posts;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;

CREATE TABLE dbo.users (
    id       INT IDENTITY(1,1) PRIMARY KEY,
    name     NVARCHAR(100)       NULL,
    email    NVARCHAR(100)       UNIQUE NULL,
    password NVARCHAR(100)       NULL
);
GO

CREATE TABLE dbo.donors (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    full_name   NVARCHAR(100) NOT NULL,
    blood_group NVARCHAR(10)  NOT NULL,
    age         INT           NULL,
    city        NVARCHAR(50)  NULL,
    phone       NVARCHAR(20)  NULL,
    created_at  DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE dbo.volunteers (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    full_name   NVARCHAR(100) NOT NULL,
    email       NVARCHAR(100) NULL,
    phone       NVARCHAR(20)  NULL,
    availability NVARCHAR(50)  NULL,
    created_at  DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE dbo.messages (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    full_name   NVARCHAR(100) NOT NULL,
    email       NVARCHAR(100) NULL,
    message     NVARCHAR(MAX) NOT NULL,
    created_at  DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE dbo.posts (
    id      INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT           NOT NULL,
    title   NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_posts_users FOREIGN KEY (user_id)
        REFERENCES dbo.users (id)
        ON DELETE CASCADE
);
GO