#!/bin/sh

# Start the .NET backend in the background
cd /app/backend
dotnet DarthSeldon.API.QRCode.Demo.dll &

# Start Nginx in the foreground
nginx -g 'daemon off;'
