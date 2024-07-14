using QRCoder;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

//minimal api
app.MapGet("/", (HttpRequest request) =>
{
    //get the query string
    var qrCodeQuery = request.Query["content"];
    var qrContent = string.Empty;

    if (qrCodeQuery.Count > 0)
        qrContent = qrCodeQuery.FirstOrDefault("No Content for QR Code");

    //generate code
    byte[] qrCodeImage;

    using (QRCodeGenerator qrGenerator = new())
    using (QRCodeData qrCodeData = qrGenerator.CreateQrCode(string.IsNullOrEmpty(qrContent) ? "https://darthseldon.net" : qrContent, QRCodeGenerator.ECCLevel.Q))
    using (PngByteQRCode qrCode = new(qrCodeData))
    {
        qrCodeImage = qrCode.GetGraphic(20);
    }

    //return as image
    var mimeType = "image/png";
    return Results.File(qrCodeImage, contentType: mimeType);
});

app.Run();