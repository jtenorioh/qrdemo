# Testing Guide

## Quick Testing Steps

### 1. Test with Docker (Recommended)

**Production Mode:**
```bash
./start-prod.sh
# OR
docker-compose up --build
```
Open browser: http://localhost:8080

**Development Mode:**
```bash
./start-dev.sh
# OR
docker-compose --profile dev up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 2. Manual Testing

**Backend Only:**
```bash
cd src
dotnet restore
dotnet run
```

Test endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# URL QR code
curl -X POST http://localhost:5000/api/qr/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}' \
  --output test-url-qr.png

# WiFi QR code
curl -X POST http://localhost:5000/api/qr/wifi \
  -H "Content-Type: application/json" \
  -d '{"ssid":"TestNetwork","password":"password123","encryptionType":"WPA"}' \
  --output test-wifi-qr.png

# Legacy endpoint
curl "http://localhost:5000/?content=https://example.com" --output legacy-qr.png
```

**Frontend Only:**
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:3000

### 3. Test Cases

#### URL QR Code:
1. Enter URL: `https://github.com/yourusername`
2. Click "Generate QR Code"
3. Verify QR code displays
4. Click "Download" and save image
5. Scan with phone to verify URL

#### WiFi QR Code:
1. Select "WiFi" tab
2. Enter SSID: `TestNetwork`
3. Enter Password: `SecurePass123!`
4. Select Encryption: `WPA/WPA2`
5. Click "Generate QR Code"
6. Verify QR code displays
7. Scan with phone's camera app
8. Verify WiFi credentials appear correctly

#### Edge Cases:
- Empty inputs (should show error)
- Special characters in WiFi password: `Test;Pass:123,`
- Very long URLs
- Hidden network toggle
- Different encryption types

### 4. Verify WiFi QR Format

Generated WiFi QR should encode to:
```
WIFI:T:WPA;S:TestNetwork;P:SecurePass123!;H:false;;
```

You can verify by scanning with:
- iOS Camera app (iOS 11+)
- Android Camera app
- QR scanner apps

### 5. Performance Testing

```bash
# Test API response time
time curl -X POST http://localhost:5000/api/qr/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  --output /dev/null
```

### 6. Docker Testing

**Verify containers:**
```bash
docker-compose ps
```

**Check logs:**
```bash
# Production
docker-compose logs -f

# Development
docker-compose --profile dev logs -f backend
docker-compose --profile dev logs -f frontend
```

**Stop services:**
```bash
docker-compose down
# or for dev
docker-compose --profile dev down
```

### 7. Mobile Testing

1. Find your local IP: `ifconfig` or `ipconfig`
2. Update docker-compose.yml allowed origins if needed
3. Access from phone: `http://YOUR_IP:8080`
4. Test generating and scanning QR codes

## Expected Results

✅ **Backend:**
- Health endpoint returns JSON with status
- URL endpoint returns PNG image
- WiFi endpoint returns PNG image
- CORS headers present in responses
- Special characters properly escaped

✅ **Frontend:**
- Page loads without errors
- Type selector switches forms
- Form validation works
- QR codes display correctly
- Download button works
- Responsive on mobile

✅ **Docker:**
- Containers start without errors
- Frontend accessible on port 8080
- API calls proxy correctly through Nginx
- Hot reload works in dev mode

## Troubleshooting

**"Port already in use":**
```bash
# Find and kill process
lsof -ti:8080 | xargs kill -9
# or change port in docker-compose.yml
```

**"Cannot connect to backend":**
- Check CORS settings in appsettings.json
- Verify VITE_API_URL in frontend/.env
- Check Nginx proxy configuration

**"QR code won't scan":**
- Verify image downloaded correctly
- Check special characters are escaped
- Try different QR scanner app

**Docker build fails:**
```bash
# Clean docker cache
docker-compose down -v
docker system prune -f
# Rebuild
docker-compose build --no-cache
```
