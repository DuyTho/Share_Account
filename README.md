# Share_Account - Fullstack E-commerce Platform

[![Build Status](https://img.shields.io/github/actions/workflow/status/DuyTho/Share_Account/deploy.yml?branch=main)](https://github.com/DuyTho/Share_Account/actions)
[![Docker Hub](https://img.shields.io/badge/docker-hub-blue.svg?logo=docker)](https://hub.docker.com/u/duytho)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready Fullstack application for account sharing in the e-commerce sector. This project demonstrates a complete lifecycle: from development with Next.js and Prisma to containerization with Docker and automated deployment on AWS EC2 via GitHub Actions.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Manual Installation](#manual-installation)
- [Architecture](#architecture)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Database Management](#database-management)
- [Author](#author)
- [License](#license)

## Features

- **Fullstack Integration**: Next.js 14 App Router communicating with a high-performance Node.js REST API.
- **Containerization**: Fully Dockerized services using multi-stage builds for performance and size optimization.
- **Database & ORM**: Robust data management using **Prisma** with **MySQL 8.0**.
- **Automated CI/CD**: Seamless automated deployment pipeline using **GitHub Actions**.
- **Cloud Infrastructure**: Scalable hosting on **AWS EC2** with optimized storage and security configurations.

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, React, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | MySQL 8.0 |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Cloud** | AWS EC2 (T3.Medium), EBS, Security Groups |

## Quick Start

To run the entire project on your local machine in less than 2 minutes:

```bash
# 1. Clone the repository
git clone [https://github.com/DuyTho/Share_Account.git](https://github.com/DuyTho/Share_Account.git)
cd Share_Account

# 2. Setup Environment (Required for DB connection)
cp .env.example .env

# 3. Launch with Docker
docker compose up -d --build
```

Access the application at http://localhost:3000 and the API at http://localhost:8080.

## Manual Installation

If you prefer to set up the environment manually for development:

1. Clone the repo:

```bash
git clone https://github.com/DuyTho/Share_Account.git
cd Share_Account
```

2. Install dependencies:

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

3. Set the environment variables:

```bash
cp .env.example .env
# Open .env and modify environment variables
```
4. Sync Database Schema:

```bash
npx prisma db push
```

## Architecture

The system utilizes a Microservices-lite architecture:

- Frontend Container: Next.js App Router, Tailwind CSS.
- Backend Container: Node.js REST API.
- Database Container: MySQL 8.0 with persistent volumes.
- Proxy/Network: Isolated Docker Bridge Network for internal service communication.

## Commands

Running locally

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down
```

Database Management

```bash
# Push schema changes to MySQL
docker exec -it share_account_backend npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio
```

Clean up 

```bash
# Remove unused Docker images/volumes to free up space
docker system prune -a --volumes
```

## Environment Variables

The environment variables must be defined in a .env file at the project root:

```bash
# MySQL Connection
DATABASE_URL="mysql://root:rootpassword@mysql-db:3306/share_account"

# SMTP Configuration (Gmail)
MAIL_USER="official.shareacc@gmail.com"
MAIL_PASS="your-app-specific-password"

# API Endpoint (Public IP for Production / Localhost for Dev)
NEXT_PUBLIC_API_URL="http://your-ec2-ip:8080"
```

## Project Structure

```bash
Share_Account\
 |--backend\           # Node.js API logic & Prisma Schema
 |--frontend\          # Next.js UI & Components
 |--docker-compose.yml # Infrastructure orchestration
 |--.github\workflows\ # CI/CD Pipeline definitions
 |--.env               # Local configuration (Git ignored)
```

## Deployment

The application is deployed on an AWS EC2 T3.Medium instance.

- Storage: Upgraded to 20GB EBS to handle Docker build layers.
- Networking: Security Groups configured for TCP ports 3000 (Frontend) and 8080 (API).
- Runtime: Docker Engine + Docker Compose V2.

## CI/CD Pipeline

We use GitHub Actions for Continuous Integration and Continuous Deployment:

1. Build: Triggered on push to main branch. Builds Docker images for both services.
2. Push: Images are tagged and pushed to Docker Hub.
3. Deploy: The runner SSHs into the EC2 instance, pulls the latest images, and restarts the containers.

## Database Management

This project uses Prisma as the ORM.

- Schema: Located in backend/prisma/schema.prisma.
- Migrations: Automated during the CD process to ensure the production database is always in sync with the source code.

## Author

[Duy Tho](#github.com/DuyTho)

## License

[MIT](#license)
