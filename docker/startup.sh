#!/bin/sh

echo "🔥 Starting Darth Seldon's QR Forge..."

# Check if backend DLL exists
if [ ! -f /app/backend/DarthSeldon.API.QRCode.Demo.dll ]; then
    echo "❌ ERROR: Backend DLL not found!"
    ls -la /app/backend/
    exit 1
fi

echo "✅ Backend DLL found"

# Start the .NET backend in the background
cd /app/backend
echo "⚡ Starting .NET backend on port 5000..."
dotnet DarthSeldon.API.QRCode.Demo.dll > /var/log/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start! Logs:"
    cat /var/log/backend.log
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"

# Start Nginx in the foreground
echo "⚔️ Starting Nginx reverse proxy..."
nginx -g 'daemon off;'
