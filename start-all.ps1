# Start Both Backend and Frontend Servers
# Run this script from the root directory

Write-Host "🚀 Starting Jewelry E-Commerce Platform..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check Java
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Java is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Java is installed" -ForegroundColor Green

# Check Maven
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Maven is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Maven is installed" -ForegroundColor Green

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js is installed" -ForegroundColor Green

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm is installed" -ForegroundColor Green

Write-Host ""
Write-Host "📋 All prerequisites met!" -ForegroundColor Green
Write-Host ""

# Check MySQL
Write-Host "🔍 Checking MySQL..." -ForegroundColor Yellow
$mysqlRunning = Get-Process mysqld -ErrorAction SilentlyContinue
if (-not $mysqlRunning) {
    Write-Host "⚠️  MySQL might not be running!" -ForegroundColor Yellow
    Write-Host "Please ensure MySQL is started before continuing" -ForegroundColor Yellow
    $continue pRead-Host "Press Enter to continue anyway or Ctrl+C to exit"
}

Write-Host ""
Write-Host "🎯 Starting services..." -ForegroundColor Cyan
Write-Host ""

# Function to start backend in a new window
Write-Host "1️⃣  Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\start-backend.ps1"

Write-Host "   ⏳ Waiting 15 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Function to start frontend in a new window
Write-Host "2️⃣  Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; .\start-frontend.ps1"

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📍 Access Points:" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎨 Frontend (React + Vite)" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "⚙️  Backend (Spring Boot)" -ForegroundColor Cyan
Write-Host "   API: http://localhost:8080/api" -ForegroundColor White
Write-Host "   Swagger: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "   • Both servers are running in separate PowerShell windows" -ForegroundColor White
Write-Host "   • Close those windows or press Ctrl+C in them to stop servers" -ForegroundColor White
Write-Host "   • Frontend will auto-open in your browser after starting" -ForegroundColor White
Write-Host "   • Check the other windows for server logs and errors" -ForegroundColor White
Write-Host ""
Write-Host "📚 Quick Links:" -ForegroundColor Green
Write-Host "   • Documentation: See SETUP_AND_RUN.md" -ForegroundColor White
Write-Host "   • API Docs: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "   • Demo Credentials: See frontend/DEMO_CREDENTIALS.md" -ForegroundColor White
Write-Host ""
Write-Host "✨ Happy coding!" -ForegroundColor Green
Write-Host ""

# Wait for user input before closing this window
Read-Host "Press Enter to close this window (servers will continue running)"
