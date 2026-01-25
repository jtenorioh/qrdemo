# Multi-stage Dockerfile for Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src

# Copy csproj and restore dependencies
COPY src/*.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY src/ ./
RUN dotnet publish -c Release -o /app/publish

# Multi-stage Dockerfile for Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Final stage - Runtime with Nginx
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS backend-runtime
WORKDIR /app
COPY --from=backend-build /app/publish .

# Use Nginx for serving frontend and reverse proxy
FROM nginx:alpine AS final
WORKDIR /app

# Install .NET runtime for backend
COPY --from=mcr.microsoft.com/dotnet/aspnet:8.0 /usr/share/dotnet /usr/share/dotnet
RUN ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet

# Copy backend application
COPY --from=backend-build /app/publish /app/backend

# Copy frontend build
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY docker/startup.sh /startup.sh
RUN chmod +x /startup.sh

EXPOSE 80

CMD ["/startup.sh"]
