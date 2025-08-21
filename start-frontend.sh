#!/bin/bash

echo "🚀 Starting AI JobChain Frontend Server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not found. Please run setup first:"
    echo "   ./run-frontend.sh"
    exit 1
fi

# Start the development server
echo "🌐 Starting Vite development server..."
echo "📍 Frontend will be available at: http://localhost:5173"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

npm run dev
