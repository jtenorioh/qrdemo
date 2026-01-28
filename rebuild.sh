#!/bin/bash
# Rebuild Darth Seldon's QR Forge after fixes

set -e

echo "⚔️ Rebuilding Darth Seldon's QR Forge with fixes..."
echo ""

# Stop and remove old containers
echo "🛑 Stopping old containers..."
sudo docker compose down -v

echo ""
echo "📦 Rebuilding with --no-cache to ensure clean build..."
sudo docker compose build --no-cache qrdemo

echo ""
echo "🚀 Starting container..."
sudo docker compose up -d qrdemo

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "📊 Container status:"
sudo docker compose ps

echo ""
echo "📜 Checking logs (last 20 lines):"
sudo docker compose logs --tail=20 qrdemo

echo ""
echo "✅ Build complete!"
echo ""
echo "🌐 Access the QR Forge at: http://localhost:8080"
echo ""
echo "📊 Follow logs with:"
echo "   sudo docker compose logs -f qrdemo"
echo ""
echo "🔍 Check backend logs inside container:"
echo "   sudo docker exec qrdemo-app cat /var/log/backend.log"
echo ""
