# QR Code Generator

A full-stack QR code generator application supporting URL and WiFi QR codes. Built with ASP.NET Core minimal API backend and React frontend.

## Features

- 🔗 **URL QR Codes** - Generate QR codes for any URL
- 📶 **WiFi QR Codes** - Generate WiFi configuration QR codes
  - Support for WPA/WPA2, WEP, and open networks
  - Hidden network support
  - Password and SSID escaping
- 🎨 **Modern React UI** - Clean, responsive interface
- 🐳 **Dockerized** - Ready for deployment with Docker Compose
- 🔄 **Hot Reload** - Development mode with live updates

## Tech Stack

**Backend:**
- ASP.NET Core 8.0 Minimal API
- QRCoder library
- CORS support

**Frontend:**
- React 18
- Vite for build tooling
- Modern CSS with responsive design

**Infrastructure:**
- Docker multi-stage builds
- Nginx for reverse proxy
- Docker Compose orchestration

## Quick Start

### Using Docker (Recommended)

**Production mode:**
```bash
docker-compose up --build
```
Access the application at http://localhost:8080

**Development mode:**
```bash
docker-compose --profile dev up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Local Development

**Backend:**
```bash
cd src
dotnet restore
dotnet run
```
Runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:3000

## API Endpoints

### URL QR Code
```http
POST /api/qr/url
Content-Type: application/json

{
  "url": "https://example.com"
}
```
Returns: PNG image

### WiFi QR Code
```http
POST /api/qr/wifi
Content-Type: application/json

{
  "ssid": "MyWiFi",
  "password": "securepassword",
  "encryptionType": "WPA",
  "hidden": false
}
```
Returns: PNG image

**Parameters:**
- `ssid` (required): Network name
- `password` (required): Network password
- `encryptionType` (optional): "WPA", "WEP", or "nopass" (default: "WPA")
- `hidden` (optional): Boolean for hidden networks (default: false)

### Legacy Endpoint
```http
GET /?content=https://example.com
```
Returns: PNG image (backward compatible)

### Health Check
```http
GET /api/health
```
Returns: JSON status

## Project Structure

```
qrdemo/
├── src/                          # Backend (.NET)
│   ├── Program.cs               # API endpoints
│   ├── *.csproj                 # Project file
│   └── appsettings.json         # Configuration
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── App.jsx              # Main component
│   │   ├── App.css              # Styles
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite config
│   └── package.json             # Dependencies
├── docker/                       # Docker files
│   ├── nginx.conf               # Nginx configuration
│   ├── startup.sh               # Container startup script
│   ├── Dockerfile.backend       # Backend dev image
│   └── Dockerfile.frontend      # Frontend dev image
├── Dockerfile                    # Production multi-stage build
└── docker-compose.yml           # Orchestration
```

## Configuration

**Backend (appsettings.json):**
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:8080"
  ]
}
```

**Frontend (.env.development):**
```
VITE_API_URL=http://localhost:5000/api
```

## Building for Production

```bash
# Build production image
docker build -t qrdemo:latest .

# Run production container
docker run -p 8080:80 qrdemo:latest
```

## Development Workflow

1. **Start development environment:**
   ```bash
   docker-compose --profile dev up
   ```

2. **Make changes:**
   - Backend changes in `src/` trigger hot reload
   - Frontend changes in `frontend/src/` reload automatically

3. **Test the API:**
   ```bash
   # Test URL QR
   curl -X POST http://localhost:5000/api/qr/url \
     -H "Content-Type: application/json" \
     -d '{"url":"https://github.com"}' \
     --output qr.png

   # Test WiFi QR
   curl -X POST http://localhost:5000/api/qr/wifi \
     -H "Content-Type: application/json" \
     -d '{"ssid":"TestNetwork","password":"password123"}' \
     --output wifi-qr.png
   ```

## WiFi QR Code Format

The application generates WiFi QR codes using the standard format:
```
WIFI:T:[encryption];S:[ssid];P:[password];H:[hidden];;
```

Example:
```
WIFI:T:WPA;S:MyNetwork;P:SecurePass123;H:false;;
```

Special characters (`;`, `:`, `,`, `\`, `"`) are automatically escaped.

## Security Considerations

- CORS is configured for specific origins
- Input validation on all API endpoints
- No sensitive data logging
- Special character escaping for WiFi credentials

## Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml
ports:
  - "8081:80"  # Instead of 8080
```

**CORS errors:**
- Check `AllowedOrigins` in appsettings.json
- Verify frontend API URL in .env files

**Build failures:**
- Ensure Docker has enough memory (4GB+ recommended)
- Clear Docker cache: `docker-compose down -v`

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.
