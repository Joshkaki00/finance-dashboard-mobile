#!/bin/bash

# Finance Dashboard Mobile - Verification Script
# This script verifies the project setup is complete

echo "=========================================="
echo "Finance Dashboard Mobile - Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counters
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        ((FAILED++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ (MISSING)"
        ((FAILED++))
    fi
}

echo "📦 Checking Core Files..."
check_file "package.json"
check_file "app.json"
check_file "App.js"
check_file "index.js"
echo ""

echo "📖 Checking Documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "TODO.md"
check_file "PROJECT_SUMMARY.md"
check_file "WEB_VS_MOBILE.md"
check_file "install.sh"
echo ""

echo "📁 Checking Directory Structure..."
check_dir "src"
check_dir "src/screens"
check_dir "src/store"
check_dir "src/navigation"
check_dir "node_modules"
check_dir "assets"
echo ""

echo "📱 Checking Screen Components..."
check_file "src/screens/DashboardScreen.js"
check_file "src/screens/TransactionsScreen.js"
check_file "src/screens/AddTransactionScreen.js"
check_file "src/screens/BudgetScreen.js"
check_file "src/screens/SettingsScreen.js"
echo ""

echo "🏪 Checking Redux Store..."
check_file "src/store/store.js"
check_file "src/store/transactionsSlice.js"
check_file "src/store/budgetSlice.js"
check_file "src/store/categoriesSlice.js"
echo ""

echo "🧭 Checking Navigation..."
check_file "src/navigation/AppNavigator.js"
echo ""

echo "📊 Checking Dependencies..."
if [ -f "package.json" ]; then
    DEPS=$(grep -c "\"dependencies\"" package.json)
    if [ $DEPS -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Dependencies declared in package.json"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} No dependencies found"
        ((FAILED++))
    fi
    
    if [ -d "node_modules" ]; then
        NODE_MODULES_COUNT=$(ls -1 node_modules | wc -l | xargs)
        echo -e "${GREEN}✓${NC} node_modules exists ($NODE_MODULES_COUNT packages)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} node_modules not found"
        ((FAILED++))
    fi
fi
echo ""

echo "=========================================="
echo "Verification Results"
echo "=========================================="
echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed!${NC}"
    echo ""
    echo "✅ Project is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. npm start          # Start development server"
    echo "  2. Press 'i' for iOS, 'a' for Android, 'w' for web"
    echo "  3. Read TODO.md for implementation tasks"
    echo ""
else
    echo -e "${RED}❌ Some checks failed!${NC}"
    echo ""
    echo "Please run: ./install.sh"
    echo ""
fi

exit $FAILED
