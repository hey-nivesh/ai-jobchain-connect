@echo off
echo 🚀 Starting AI JobChain Frontend Server...

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Dependencies not found. Please run setup first:
    echo    run-frontend.bat
    pause
    exit /b 1
)

REM Start the development server
echo 🌐 Starting Vite development server...
echo 📍 Frontend will be available at: http://localhost:5173
echo 🛑 Press Ctrl+C to stop the server
echo.

npm run dev
