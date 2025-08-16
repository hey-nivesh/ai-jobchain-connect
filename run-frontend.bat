@echo off
echo 🚀 Setting up AI JobChain Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Install dependencies
echo 📚 Installing dependencies...
npm install

REM Check if installation was successful
if not exist "node_modules" (
    echo ❌ Dependencies installation failed.
    pause
    exit /b 1
)

echo ✅ Frontend setup complete!
echo.
echo 🎯 To start the frontend server:
echo    npm run dev
echo.
echo 🌐 Frontend will be available at: http://localhost:5173
echo 📱 Backend API should be running at: http://localhost:8000
pause
