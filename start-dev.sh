#!/bin/bash

echo "🚀 Starting QR Demo Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building containers..."
docker-compose --profile dev up --build

# Cleanup on exit
trap "docker-compose --profile dev down" EXIT
