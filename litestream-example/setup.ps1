# Litestream Example Setup Script
# Downloads required tools and sets up the example database

Write-Host "Setting up Litestream example..." -ForegroundColor Green

# Download SQLite tools
$sqliteVersion = "sqlite-tools-win-x64-3480000"
$sqliteUrl = "https://www.sqlite.org/2025/$sqliteVersion.zip"
Write-Host "Downloading SQLite tools..." -ForegroundColor Yellow

if (!(Test-Path "sqlite-tools.zip")) {
    Invoke-WebRequest -Uri $sqliteUrl -OutFile "sqlite-tools.zip"
}

Write-Host "Extracting SQLite tools..." -ForegroundColor Yellow
Expand-Archive -Path "sqlite-tools.zip" -DestinationPath "." -Force
Copy-Item "$sqliteVersion\*" -Destination "." -Force
Remove-Item $sqliteVersion -Recurse -Force

# Download Litestream
$litestreamVersion = "v0.5.0"
$litestreamUrl = "https://github.com/benbjohnson/litestream/releases/download/$litestreamVersion/litestream-$litestreamVersion-windows-amd64.zip"
Write-Host "Downloading Litestream..." -ForegroundColor Yellow

if (!(Test-Path "litestream.zip")) {
    Invoke-WebRequest -Uri $litestreamUrl -OutFile "litestream.zip"
}

Write-Host "Extracting Litestream..." -ForegroundColor Yellow
Expand-Archive -Path "litestream.zip" -DestinationPath "." -Force
Remove-Item "litestream.zip" -Force

# Create sample database
Write-Host "Creating sample database..." -ForegroundColor Yellow
& .\sqlite3.exe fruits.db @"
CREATE TABLE fruits (name TEXT, color TEXT);
INSERT INTO fruits (name, color) VALUES ('apple', 'red');
INSERT INTO fruits (name, color) VALUES ('banana', 'yellow');
"@

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Start Docker Desktop"
Write-Host "2. Run: docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ':9001'"
Write-Host "3. Create bucket 'mybkt' at http://localhost:9001 (minioadmin/minioadmin)"
Write-Host "4. Set environment variables:"
Write-Host "   `$env:LITESTREAM_ACCESS_KEY_ID='minioadmin'"
Write-Host "   `$env:LITESTREAM_SECRET_ACCESS_KEY='minioadmin'"
Write-Host "5. Run: .\litestream.exe replicate fruits.db s3://mybkt.localhost:9000/fruits.db"
