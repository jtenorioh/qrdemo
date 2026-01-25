# QR Demo - Quick Reference Card

## 🚀 Getting Started (Choose One)

### Option 1: Production Mode (Recommended for Testing)
```bash
./start-prod.sh
```
**Access:** http://localhost:8080

### Option 2: Development Mode (Hot Reload)
```bash
./start-dev.sh
```
**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Option 3: Manual
```bash
# Terminal 1 - Backend
cd src
dotnet run

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## 📋 Quick Commands

```bash
# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild everything
docker-compose build --no-cache

# Clean Docker
docker-compose down -v
docker system prune -f

# Run tests
cd src && dotnet test

# Check git status
git status
git log --oneline -5
```

## 🧪 Quick API Test

```bash
# URL QR Code
curl -X POST http://localhost:5000/api/qr/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}' \
  --output test.png

# WiFi QR Code
curl -X POST http://localhost:5000/api/qr/wifi \
  -H "Content-Type: application/json" \
  -d '{"ssid":"TestWiFi","password":"Pass123"}' \
  --output wifi.png
```

## 🎯 Testing Checklist

- [ ] Start application (production or dev mode)
- [ ] Test URL QR generation
- [ ] Test WiFi QR generation with WPA
- [ ] Test WiFi QR with special characters
- [ ] Download QR code
- [ ] Scan QR with mobile device
- [ ] Verify WiFi auto-connect works
- [ ] Test responsive design on mobile
- [ ] Test error handling (empty inputs)

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/Program.cs` | Backend API with QR generation |
| `frontend/src/App.jsx` | React UI component |
| `docker-compose.yml` | Docker orchestration |
| `Dockerfile` | Production build |
| `docker/nginx.conf` | Nginx reverse proxy config |
| `README.md` | Full documentation |
| `TESTING.md` | Testing guide |

## 🔧 Environment Variables

**Frontend (.env.development):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (appsettings.json):**
```json
{
  "AllowedOrigins": ["http://localhost:3000"]
}
```

## 📱 WiFi QR Format

```
WIFI:T:WPA;S:NetworkName;P:password123;H:false;;
```

Components:
- `T`: Encryption type (WPA, WEP, nopass)
- `S`: SSID (network name)
- `P`: Password
- `H`: Hidden network (true/false)

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Change port in docker-compose.yml |
| CORS error | Check AllowedOrigins in appsettings.json |
| Can't connect to API | Verify VITE_API_URL in .env |
| Docker build fails | Run `docker system prune -f` |
| QR won't scan | Check special characters are escaped |

## 📊 Project Stats

- **Backend:** ASP.NET Core 8.0, QRCoder library
- **Frontend:** React 18, Vite 5
- **Docker:** Multi-stage builds, Nginx reverse proxy
- **Files:** 23 source files
- **Endpoints:** 4 API endpoints
- **QR Types:** 2 (URL, WiFi)

## ✅ Current Branch

```
feature/qr-generator-ui
```

All changes committed and ready for testing!

---

**Pro Tips:**
- Use `./start-prod.sh` for quick testing
- Mobile scan WiFi QR to test auto-connect
- Check `TESTING.md` for detailed test cases
- See `IMPLEMENTATION.md` for full feature list
