#!/bin/bash

# Jewelry E-Commerce Frontend - Quick Setup Script

echo "🎨 Setting up Jewelry E-Commerce Frontend..."
echo ""

# Check Node version
echo "✓ Checking Node.js..."
node_version=$(node -v)
echo "  Using Node $node_version"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo "  Update API_URL if your backend is on a different port"
else
    echo "✓ .env.local already exists"
fi
echo ""

# Final instructions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "📦 Build for production:"
echo "   npm run build"
echo ""
echo "🔍 Lint code:"
echo "   npm run lint"
echo ""
echo "📖 Documentation:"
echo "   - See FRONTEND.md for detailed documentation"
echo "   - See .env.example for configuration options"
echo ""
echo "🌐 Default URLs:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8080/api"
echo ""
