Write-Host "🚀 Launching The Sentinel: Gravity-Defying Edition" -ForegroundColor Cyan

# 1. Backend Setup
if (-Not (Test-Path "backend\venv")) {
    Write-Host "📦 Creating Python Virtual Environment..." -ForegroundColor Yellow
    python -m venv backend\venv
}

Write-Host "🐍 Starting Backend (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt; uvicorn main:app --reload --port 8000"

# 2. Frontend Setup
cd frontend
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Node dependencies..." -ForegroundColor Green
    npm install
}

# Check if 'dev' script exists in package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.scripts.dev) {
    Write-Host "⚛️ Starting Frontend Server..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "❌ Error: 'dev' script not found in package.json!" -ForegroundColor Red
    Write-Host "Add '\"dev\": \"vite\"' to your scripts section." -ForegroundColor Gray
}