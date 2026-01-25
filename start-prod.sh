#!/bin/bash

echo "🚀 Building and starting QR Demo in Production mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start
echo "📦 Building production container..."
docker-compose up --build -d

echo "✅ Application is running at http://localhost:8080"
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
