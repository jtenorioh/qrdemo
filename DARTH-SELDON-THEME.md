# Darth Seldon's QR Forge - Sith Lord Theme

## 🎭 Theme Overview

This QR Code Generator has been transformed to embody the power and authority of Darth Seldon, a Sith Lord commanding the dark arts of cryptography.

### Visual Theme
- **Dark red color scheme** - Imperial red (#dc2626, #b91c1c, #7f1d1d)
- **Sith glow effects** - Red shadows and glows throughout
- **Imperial background** - Red radial gradients with grid overlay
- **Dark containers** - Black with red borders and shadows

### Content Theme
- **Title:** "Darth Seldon's QR Forge"
- **Motto:** "You don't know the power of the dark side"
- **Imperial language** - Dramatic, authoritative commands
- **Power-themed actions** - Forge, Claim, Command

## 🐳 Docker Build & Test

### Quick Start (Production)

Build and run the complete application:

```bash
./build-and-run.sh
```

Or manually:

```bash
# Build the image
sudo docker compose build qrdemo

# Start the container
sudo docker compose up -d qrdemo

# Access at http://localhost:8080
```

### Development Mode

Run with hot-reload for both frontend and backend:

```bash
sudo docker compose --profile dev up --build
```

Access:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Testing

1. **URL QR Code:**
   - Select "🔗 URL" tab
   - Enter a URL (e.g., https://github.com)
   - Click "🔥 Forge QR Code"
   - Click "📥 Claim Power" to download

2. **WiFi QR Code:**
   - Select "📶 WiFi" tab
   - Enter SSID and password
   - Choose encryption type
   - Click "🔥 Forge QR Code"
   - Scan with phone to connect to WiFi

### Docker Commands

```bash
# View logs
sudo docker compose logs -f qrdemo

# Stop containers
sudo docker compose down

# Remove volumes
sudo docker compose down -v

# Rebuild from scratch
sudo docker compose build --no-cache qrdemo
```

## 📊 Image Specifications

**Production Build:**
- Multi-stage build (Backend + Frontend)
- Backend: .NET 8 SDK → ASP.NET Runtime
- Frontend: Node 20 → Static build
- Nginx reverse proxy
- Optimized size: ~200-300 MB

**Ports:**
- Production: 8080 → 80 (Nginx)
- Dev Backend: 5000
- Dev Frontend: 3000

## 🎨 Theme Files Modified

1. **frontend/src/index.css**
   - Dark Sith background with red gradients
   - Imperial grid overlay

2. **frontend/src/App.css**
   - Complete red theme transformation
   - Sith glow effects
   - Dark containers with red borders

3. **frontend/src/App.jsx**
   - Updated header with Darth Seldon branding
   - Power-themed button text
   - Imperial language throughout

## 🚀 Deployment

### Local Testing
```bash
./build-and-run.sh
# Visit http://localhost:8080
```

### Cloud Deployment

**Push to Docker Hub:**
```bash
sudo docker tag qrdemo:latest yourusername/darth-seldon-qr:latest
sudo docker push yourusername/darth-seldon-qr:latest
```

**Run anywhere:**
```bash
docker pull yourusername/darth-seldon-qr:latest
docker run -p 8080:80 yourusername/darth-seldon-qr:latest
```

## 🎯 Features

- ✅ URL QR Code generation
- ✅ WiFi QR Code generation (WPA/WEP/Open)
- ✅ Hidden network support
- ✅ Download QR codes as PNG
- ✅ Responsive design
- ✅ Dark Sith Lord theme
- ✅ Docker production build
- ✅ Docker development mode

## 🔧 Troubleshooting

**Port 8080 already in use:**
```bash
# Edit docker-compose.yml, change ports:
ports:
  - "8081:80"
```

**Build failures:**
```bash
# Clear Docker cache
sudo docker compose down -v
sudo docker compose build --no-cache
```

**Permission denied (Docker):**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

## 📝 Git Commands

```bash
# Commit changes
git add -A
git commit -m "Your message"

# Push to branch
git push origin feature/qr-generator-ui

# Create PR
gh pr create --title "Sith Lord Theme" --base main
```

---

**All systems operational. The dark side of QR generation is yours to command.** ⚔️
