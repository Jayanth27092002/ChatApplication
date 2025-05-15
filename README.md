# ChatApplication - Dockerized Fullstack Chat App

This repo contains a fullstack chat application with separate **frontend** and **backend** directories, both dockerized and orchestrated with Docker Compose.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Environment variables set in a `.env` file (see below)

---

## Setup

1. Create a `.env` file in the root directory with the following variables:

MONGO_URI=mongodb://mongo:27017/chatappdb
JWT_SECRETKEY=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:3000
ADMIN_SECRET_KEY=your_admin_secret_key 


2. Build and start containers:

```bash
docker-compose up --build


Frontend UI: http://localhost:3000

Backend API: http://localhost:4000

dock


The frontend is built inside the container using the VITE_SERVER build argument to point API calls to the backend service (http://backend:4000 internally).

The backend connects to MongoDB via the internal Docker network using MONGO_URI.

MongoDB data persists between container restarts using Docker volumes.

You can customize ports or environment variables by editing docker-compose.yml and .env.