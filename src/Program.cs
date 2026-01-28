using QRCoder;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
            ?? new[] { "http://localhost:3000", "http://localhost:8080" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Legacy endpoint for backward compatibility
app.MapGet("/", (HttpRequest request) =>
{
    var qrCodeQuery = request.Query["content"];
    var qrContent = string.Empty;

    if (qrCodeQuery.Count > 0)
        qrContent = qrCodeQuery.FirstOrDefault("No Content for QR Code");

    byte[] qrCodeImage = GenerateQRCode(string.IsNullOrEmpty(qrContent) ? "https://darthseldon.net" : qrContent);
    return Results.File(qrCodeImage, contentType: "image/png");
});

// New API endpoint for URL QR codes
app.MapPost("/api/qr/url", (UrlQRRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Url))
        return Results.BadRequest(new { error = "URL is required" });

    try
    {
        byte[] qrCodeImage = GenerateQRCode(request.Url);
        return Results.File(qrCodeImage, contentType: "image/png", fileDownloadName: "qr-code.png");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error generating QR code: {ex.Message}");
    }
});

// New API endpoint for WiFi QR codes
app.MapPost("/api/qr/wifi", (WiFiQRRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Ssid))
        return Results.BadRequest(new { error = "SSID is required" });

    if (string.IsNullOrWhiteSpace(request.Password))
        return Results.BadRequest(new { error = "Password is required" });

    try
    {
        // WiFi QR code format: WIFI:T:WPA;S:SSID;P:password;H:hidden;;
        var encryptionType = request.EncryptionType?.ToUpper() ?? "WPA";
        var hidden = request.Hidden ? "true" : "false";
        
        var wifiString = $"WIFI:T:{encryptionType};S:{EscapeWiFiString(request.Ssid)};P:{EscapeWiFiString(request.Password)};H:{hidden};;";
        
        byte[] qrCodeImage = GenerateQRCode(wifiString);
        return Results.File(qrCodeImage, contentType: "image/png", fileDownloadName: "wifi-qr-code.png");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error generating WiFi QR code: {ex.Message}");
    }
});

app.Run();

// Helper methods
static byte[] GenerateQRCode(string content)
{
    using QRCodeGenerator qrGenerator = new();
    using QRCodeData qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
    using PngByteQRCode qrCode = new(qrCodeData);
    return qrCode.GetGraphic(20);
}

static string EscapeWiFiString(string input)
{
    // Escape special characters for WiFi QR format
    return input.Replace("\\", "\\\\")
                .Replace(";", "\\;")
                .Replace(",", "\\,")
                .Replace(":", "\\:")
                .Replace("\"", "\\\"");
}

// Request models
record UrlQRRequest(string Url);
record WiFiQRRequest(string Ssid, string Password, string? EncryptionType = "WPA", bool Hidden = false);