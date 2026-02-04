#!/bin/bash
# Build and test Darth Seldon's QR Forge locally with Docker

set -e

echo "⚔️ Building Darth Seldon's QR Forge..."
echo ""

# Build the Docker image
echo "📦 Building production image..."
sudo docker compose build qrdemo

echo ""
echo "🚀 Starting container..."
sudo docker compose up -d qrdemo

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "✅ Container started successfully!"
echo ""
echo "🌐 Access the QR Forge at:"
echo "   http://localhost:8080"
echo ""
echo "📊 Check logs with:"
echo "   sudo docker compose logs -f qrdemo"
echo ""
echo "🛑 Stop with:"
echo "   sudo docker compose down"
echo ""
