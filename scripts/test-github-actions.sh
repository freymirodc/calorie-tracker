#!/bin/bash

# 🧪 GitHub Actions Workflow Test Script
# This script helps test the CI/CD pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
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

print_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

echo "🧪 Testing GitHub Actions Workflow Setup"
echo "========================================"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This is not a git repository. Please run from project root."
    exit 1
fi

print_success "Git repository detected"

# Check if GitHub Actions workflow exists
if [ ! -f ".github/workflows/release.yml" ]; then
    print_error "GitHub Actions workflow file not found!"
    exit 1
fi

print_success "GitHub Actions workflow file found"

# Check if semantic release config exists
if [ ! -f ".releaserc.json" ]; then
    print_error "Semantic release configuration not found!"
    exit 1
fi

print_success "Semantic release configuration found"

# Check if Netlify config exists
if [ ! -f "netlify.toml" ]; then
    print_error "Netlify configuration not found!"
    exit 1
fi

print_success "Netlify configuration found"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: $CURRENT_BRANCH"

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Commit them first."
    git status --short
    echo ""
fi

# Check remote origin
if git remote get-url origin >/dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin)
    print_success "Remote origin: $REMOTE_URL"
else
    print_error "No remote origin configured!"
    print_info "Add remote: git remote add origin https://github.com/freymirodc/calorie-tracker.git"
    exit 1
fi

# Test build locally
print_step "Testing local build..."
if npm run build >/dev/null 2>&1; then
    print_success "Local build successful"
else
    print_error "Local build failed! Fix build errors before testing workflow."
    exit 1
fi

# Test type checking
print_step "Testing TypeScript..."
if npm run type-check >/dev/null 2>&1; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript check failed (this won't block the workflow)"
fi

# Test linting
print_step "Testing ESLint..."
if npm run lint >/dev/null 2>&1; then
    print_success "Linting passed"
else
    print_warning "Linting failed (this won't block the workflow)"
fi

echo ""
echo "🎯 Workflow Test Scenarios"
echo "=========================="
echo ""

print_info "Scenario 1: Test PR Workflow"
echo "   1. Create a feature branch: git checkout -b test/github-actions"
echo "   2. Make a small change and commit with conventional format"
echo "   3. Push branch: git push origin test/github-actions"
echo "   4. Create PR to main branch on GitHub"
echo "   5. Check Actions tab for workflow run"
echo ""

print_info "Scenario 2: Test Release Workflow"
echo "   1. Merge the PR to main branch"
echo "   2. Check Actions tab for release workflow"
echo "   3. Verify new release is created in GitHub"
echo "   4. Check Netlify deployment status"
echo ""

print_info "Scenario 3: Test Conventional Commits"
echo "   Examples of commit messages that trigger different version bumps:"
echo "   - feat: add new feature (minor version bump)"
echo "   - fix: resolve bug (patch version bump)"
echo "   - feat!: breaking change (major version bump)"
echo "   - docs: update documentation (no version bump)"
echo ""

# Create test commit if requested
read -p "🤔 Do you want to create a test commit now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Creating test commit..."
    
    # Create a simple test file
    echo "# GitHub Actions Test" > test-workflow.md
    echo "This file was created to test the GitHub Actions workflow." >> test-workflow.md
    echo "Created at: $(date)" >> test-workflow.md
    
    git add test-workflow.md
    git commit -m "test: add GitHub Actions workflow test file

This commit tests the CI/CD pipeline setup including:
- Conventional commit format
- Semantic release configuration
- GitHub Actions workflow
- Vercel deployment integration"
    
    print_success "Test commit created!"
    print_info "Push with: git push origin $CURRENT_BRANCH"
fi

echo ""
echo "🔍 Next Steps to Test Workflow"
echo "=============================="
echo ""
print_info "1. Push your changes to GitHub:"
echo "   git push origin $CURRENT_BRANCH"
echo ""
print_info "2. Create a Pull Request to main branch"
echo ""
print_info "3. Monitor the workflow in GitHub Actions:"
echo "   https://github.com/freymirodc/calorie-tracker/actions"
echo ""
print_info "4. Check Netlify deployments:"
echo "   https://app.netlify.com/"
echo ""
print_info "5. Verify release creation (after merge to main):"
echo "   https://github.com/freymirodc/calorie-tracker/releases"
echo ""

print_success "GitHub Actions test setup complete!"
print_info "The workflow will run automatically when you push to GitHub."

echo ""
echo "📋 Workflow Checklist"
echo "===================="
echo "✅ GitHub Actions workflow configured"
echo "✅ Semantic release setup"
echo "✅ Netlify configuration ready"
echo "✅ Conventional commits format"
echo "✅ Local build test passed"
echo "⏳ Waiting for GitHub push to test workflow"
echo ""
print_info "Happy testing! 🚀"
