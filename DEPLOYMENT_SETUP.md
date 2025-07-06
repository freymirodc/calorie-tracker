# 🚀 Deployment Setup Guide

This guide will help you set up automatic releases and Vercel deployment for your Calorie Tracker application.

## 📋 Prerequisites

- GitHub repository: `https://github.com/freymirodc/calorie-tracker.git`
- Vercel account (free tier available)
- Supabase project with environment variables

## 🔧 Setup Steps

### 1. Install Dependencies

First, install the new dependencies for semantic release:

```bash
npm install
```

### 2. GitHub Repository Setup

#### Create develop branch
```bash
# Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# Set develop as default branch for PRs (optional)
# Go to GitHub repo settings > Branches > Default branch
```

#### Configure Branch Protection (Recommended)
1. Go to your GitHub repository
2. Navigate to **Settings** > **Branches**
3. Add protection rules for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

### 3. Vercel Setup

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Import your repository

#### Step 2: Configure Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Step 3: Get Vercel Tokens
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with name "GitHub Actions"
3. Copy the token (you'll need it for GitHub secrets)

#### Step 4: Get Vercel Project IDs
Run these commands in your project directory:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your org and project IDs
cat .vercel/project.json
```

### 4. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:

```
VERCEL_TOKEN=your_vercel_token_from_step_3
VERCEL_ORG_ID=your_org_id_from_vercel_project_json
VERCEL_PROJECT_ID=your_project_id_from_vercel_project_json
```

### 5. Workflow Overview

The GitHub Actions workflow will:

#### On Pull Requests to main:
- ✅ Run tests and build
- ✅ Deploy preview to Vercel
- ✅ Comment on PR with preview link

#### On Push to main (merge):
- ✅ Run tests and build
- ✅ Create automatic release with semantic versioning
- ✅ Generate changelog
- ✅ Deploy to Vercel production

## 📝 Commit Message Convention

Use conventional commits for automatic versioning:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `perf`: Performance improvement (patch version bump)
- `refactor`: Code refactoring (patch version bump)
- `docs`: Documentation changes (no version bump)
- `style`: Code style changes (no version bump)
- `test`: Test changes (no version bump)
- `chore`: Maintenance tasks (no version bump)
- `ci`: CI/CD changes (no version bump)
- `build`: Build system changes (no version bump)

### Examples
```bash
# Feature (minor version bump: 1.0.0 → 1.1.0)
git commit -m "feat: add circular fasting progress tracker"

# Bug fix (patch version bump: 1.1.0 → 1.1.1)
git commit -m "fix: resolve FAB positioning issue on mobile"

# Breaking change (major version bump: 1.1.1 → 2.0.0)
git commit -m "feat!: redesign authentication system

BREAKING CHANGE: authentication API has changed"

# Documentation (no version bump)
git commit -m "docs: update deployment setup guide"
```

## 🔄 Deployment Workflow

### Development Process
1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit** using conventional commits
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and create PR** to `develop`
   ```bash
   git push origin feature/your-feature-name
   # Create PR to develop branch on GitHub
   ```

4. **Merge to develop** after review

5. **Create release PR** from `develop` to `main`
   ```bash
   # Create PR from develop to main
   # This will trigger preview deployment
   ```

6. **Merge to main** to trigger:
   - ✅ Automatic release creation
   - ✅ Version bump
   - ✅ Changelog generation
   - ✅ Production deployment

## 🎯 Release Process

### Automatic Releases
When you merge to `main`, the system will:

1. **Analyze commits** since last release
2. **Determine version bump** based on commit types
3. **Generate changelog** from commit messages
4. **Create GitHub release** with release notes
5. **Update package.json** version
6. **Deploy to Vercel** production

### Manual Release (if needed)
```bash
npm run release
```

## 🔍 Monitoring

### Check Deployment Status
- **Vercel Dashboard**: Monitor deployments and performance
- **GitHub Actions**: View workflow runs and logs
- **GitHub Releases**: See all releases and changelogs

### Useful Links
- Vercel Project: `https://vercel.com/dashboard`
- GitHub Actions: `https://github.com/freymirodc/calorie-tracker/actions`
- GitHub Releases: `https://github.com/freymirodc/calorie-tracker/releases`

## 🆘 Troubleshooting

### Common Issues

1. **Build fails**: Check environment variables in Vercel
2. **Release not created**: Ensure conventional commit format
3. **Deployment fails**: Verify Vercel tokens and project IDs
4. **No version bump**: Check if commits follow conventional format

### Debug Commands
```bash
# Test semantic release locally (dry run)
npx semantic-release --dry-run

# Check Vercel deployment logs
vercel logs

# Validate conventional commits
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

## ✅ Verification

After setup, test the workflow:

1. Create a feature branch
2. Make a commit with `feat: test deployment setup`
3. Create PR to main
4. Merge PR
5. Check that:
   - ✅ Release is created on GitHub
   - ✅ Version is bumped in package.json
   - ✅ App is deployed to Vercel
   - ✅ Changelog is updated

🎉 **Congratulations!** Your automated deployment pipeline is ready!
