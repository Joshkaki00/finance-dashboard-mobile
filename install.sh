#!/bin/bash

# Finance Dashboard Mobile - Installation Script
# This script installs all dependencies for the React Native mobile app

set -e  # Exit on error

echo "=========================================="
echo "Finance Dashboard Mobile - Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Install core dependencies
npm install

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Start the development server:"
echo "   npm start"
echo ""
echo "2. Run on a platform:"
echo "   - iOS:     npm run ios"
echo "   - Android: npm run android"
echo "   - Web:     npm run web"
echo ""
echo "3. Or scan the QR code with Expo Go app on your phone"
echo ""
echo "📱 Project Structure:"
echo "   src/screens/     - Screen components"
echo "   src/store/       - Redux state management"
echo "   src/navigation/  - Navigation setup"
echo ""
echo "📖 Read README.md for more information"
echo ""
echo "🎉 Setup complete! Happy coding!"
echo ""
