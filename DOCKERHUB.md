# QR Code Generator

A full-stack QR code generator for URL and WiFi QR codes. Built with ASP.NET Core 8.0, React 18, and Nginx — all packaged in a single container.

## Supported Tags

- `latest` — latest stable release

## Quick Start

```bash
docker run -d -p 8080:80 qrdemo-app
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## What's Included

- **URL QR Codes** — Generate QR codes for any URL
- **WiFi QR Codes** — Generate WiFi configuration QR codes with WPA/WPA2, WEP, and open network support
- **Modern UI** — Clean, responsive React interface
- **API** — REST endpoints for programmatic QR code generation

## Usage

### Docker Run

```bash
docker run -d \
  --name qrdemo \
  -p 8080:80 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ASPNETCORE_URLS=http://+:5000 \
  qrdemo-app
```

### Docker Compose

```yaml
services:
  qrdemo:
    image: qrdemo-app
    ports:
      - "8080:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:5000
    restart: unless-stopped
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Runtime environment (`Production` or `Development`) |
| `ASPNETCORE_URLS` | `http://+:5000` | Internal backend listen address |
| `AllowedOrigins__0` | `http://localhost` | CORS allowed origin (add more with `__1`, `__2`, etc.) |

## Exposed Ports

| Port | Protocol | Description |
|---|---|---|
| `80` | HTTP | Nginx serves the React UI and proxies `/api/*` to the .NET backend |

## API Endpoints

### Generate URL QR Code

```bash
curl -X POST http://localhost:8080/api/qr/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  --output qr.png
```

### Generate WiFi QR Code

```bash
curl -X POST http://localhost:8080/api/qr/wifi \
  -H "Content-Type: application/json" \
  -d '{"ssid":"MyNetwork","password":"secret","encryptionType":"WPA","hidden":false}' \
  --output wifi-qr.png
```

### Health Check

```bash
curl http://localhost:8080/api/health
```

## Architecture

```
┌──────────────────────────────────┐
│           Container (port 80)    │
│                                  │
│  ┌────────────┐  ┌────────────┐  │
│  │   Nginx    │──│  React SPA │  │
│  │  (port 80) │  │  /var/www  │  │
│  └─────┬──────┘  └────────────┘  │
│        │ /api/*                  │
│  ┌─────▼──────┐                  │
│  │  .NET 8.0  │                  │
│  │ (port 5000)│                  │
│  └────────────┘                  │
└──────────────────────────────────┘
```

- **Nginx** serves the React frontend and reverse-proxies API requests to the .NET backend
- **ASP.NET Core 8.0** handles QR code generation using the QRCoder library
- Both processes run inside a single container, managed by a startup script

## Image Details

- **Base image**: `mcr.microsoft.com/dotnet/aspnet:8.0` (Debian Bookworm)
- **Size**: ~335 MB
- **Multi-stage build**: .NET SDK + Node 20 Alpine for build, ASP.NET runtime for production

## Source Code

[GitHub Repository](https://github.com/your-username/qrdemo)

## License

MIT
