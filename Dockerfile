# Multi-stage Dockerfile for Darth Seldon's QR Forge
# Backend (.NET 8) + Frontend (React + Vite) + Nginx

# Stage 1: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src

# Copy csproj and restore dependencies
COPY src/*.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY src/ ./
RUN dotnet publish -c Release -o /app/backend

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 3: Final Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Copy backend from build stage
COPY --from=backend-build /app/backend ./backend

# Copy frontend from build stage
COPY --from=frontend-build /app/dist /var/www/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy startup script and fix line endings (Windows CRLF -> Unix LF)
COPY docker/startup.sh /startup.sh
RUN sed -i 's/\r$//' /startup.sh && chmod +x /startup.sh

# Expose port 80
EXPOSE 80

# Run startup script
CMD ["/startup.sh"]
