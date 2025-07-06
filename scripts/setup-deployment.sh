#!/bin/bash

# 🚀 Calorie Tracker Deployment Setup Script
# This script helps set up the deployment pipeline

set -e

echo "🚀 Setting up Calorie Tracker deployment pipeline..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This is not a git repository. Please run 'git init' first."
    exit 1
fi

print_status "Git repository detected"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Package.json found"

# Install dependencies
print_info "Installing dependencies..."
if npm ci; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if develop branch exists, create if not
if git show-ref --verify --quiet refs/heads/develop; then
    print_status "Develop branch already exists"
else
    print_info "Creating develop branch..."
    git checkout -b develop
    git push -u origin develop
    print_status "Develop branch created and pushed"
fi

# Check if main branch exists
if git show-ref --verify --quiet refs/heads/main; then
    print_status "Main branch exists"
else
    print_warning "Main branch not found. You may need to rename your default branch to 'main'"
    print_info "Run: git branch -M main && git push -u origin main"
fi

# Create initial commit if needed
if [ -z "$(git log --oneline 2>/dev/null)" ]; then
    print_info "Creating initial commit..."
    git add .
    git commit -m "feat: initial commit with deployment setup

- Add GitHub Actions workflow for automated releases
- Configure semantic-release for version management
- Set up Vercel deployment configuration
- Add comprehensive deployment documentation"
    print_status "Initial commit created"
fi

# Check if remote origin exists
if git remote get-url origin >/dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin)
    print_status "Remote origin configured: $REMOTE_URL"
else
    print_warning "No remote origin configured"
    print_info "Please add your GitHub repository as origin:"
    print_info "git remote add origin https://github.com/freymirodc/calorie-tracker.git"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
print_info "1. Set up Vercel account and import your repository"
print_info "2. Configure environment variables in Vercel dashboard"
print_info "3. Add GitHub secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)"
print_info "4. Create a feature branch and test the workflow"
echo ""
print_info "📖 See DEPLOYMENT_SETUP.md for detailed instructions"
echo ""
print_status "Happy coding! 🚀"
