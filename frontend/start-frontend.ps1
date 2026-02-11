# Start E-Commerce Frontend Development Server
# Run this script from the frontend directory

Write-Host "🎨 Starting Jewelry E-Commerce Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Display Node.js version
Write-Host "📦 Node.js Version:" -ForegroundColor Green
node --version
Write-Host ""

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}

Write-Host "📦 npm Version:" -ForegroundColor Green
npm --version
Write-Host ""

# Navigate to frontend directory if not already there
$currentPath = Get-Location
if ($currentPath.Path -notlike "*frontend") {
    Write-Host "📁 Navigating to frontend directory..." -ForegroundColor Yellow
    Set-Location -Path "frontend" -ErrorAction SilentlyContinue
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Are you in the correct directory?" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found. Creating default configuration..." -ForegroundColor Yellow
    @"
# Backend API Configuration
VITE_API_URL=http://localhost:8080/api

# Environment
NODE_ENV=development
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚀 Starting Vite development server..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host "🔗 Backend API: http://localhost:8080/api" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Make sure the backend is running on port 8080!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start Vite dev server
npm run dev
