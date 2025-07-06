# 🧪 GitHub Actions Workflow Test Guide

This guide will help you test the complete CI/CD pipeline including GitHub Actions, semantic releases, and Vercel deployment.

## 🎯 Test Objectives

- ✅ Verify GitHub Actions workflow triggers correctly
- ✅ Test semantic release automation
- ✅ Confirm Vercel deployment integration
- ✅ Validate conventional commit processing
- ✅ Check PR preview deployments

## 🚀 Quick Test

### Option 1: Run Test Script
```bash
# Make script executable and run
chmod +x scripts/test-github-actions.sh
./scripts/test-github-actions.sh
```

### Option 2: Manual Test Steps
Follow the detailed steps below for a comprehensive test.

## 📋 Detailed Test Procedure

### Step 1: Pre-Test Verification

1. **Check local setup**:
   ```bash
   # Verify all files are present
   ls -la .github/workflows/release.yml
   ls -la .releaserc.json
   ls -la vercel.json
   
   # Test local build
   npm run build
   npm run type-check
   npm run lint
   ```

2. **Verify Git setup**:
   ```bash
   git status
   git remote -v
   ```

### Step 2: Test PR Workflow

1. **Create test branch**:
   ```bash
   git checkout -b test/github-actions-workflow
   ```

2. **Make a test change**:
   ```bash
   # Add a simple test file
   echo "# GitHub Actions Test - $(date)" > test-workflow-$(date +%s).md
   git add .
   ```

3. **Commit with conventional format**:
   ```bash
   git commit -m "test: add GitHub Actions workflow verification

   This commit tests the complete CI/CD pipeline including:
   - GitHub Actions workflow execution
   - Semantic release configuration
   - Vercel deployment integration
   - Conventional commit message parsing"
   ```

4. **Push and create PR**:
   ```bash
   git push origin test/github-actions-workflow
   ```

5. **Create Pull Request on GitHub**:
   - Go to your repository on GitHub
   - Click "Compare & pull request"
   - Set base branch to `main`
   - Create the PR

### Step 3: Monitor PR Workflow

1. **Check GitHub Actions**:
   - Go to `Actions` tab in your repository
   - Look for the workflow run triggered by your PR
   - Verify these jobs run:
     - ✅ `test` - Build and test verification
     - ✅ `deploy-preview` - Vercel preview deployment

2. **Expected PR Workflow Results**:
   ```
   ✅ Test and Build
     ├── Checkout code
     ├── Setup Node.js
     ├── Install dependencies
     ├── Run type check
     ├── Run linting
     ├── Build application
     └── Upload build artifacts
   
   ✅ Deploy Preview
     ├── Checkout code
     ├── Setup Node.js
     ├── Install dependencies
     ├── Download build artifacts
     └── Deploy Preview to Vercel
   ```

3. **Check PR Comments**:
   - Look for automated comment about preview deployment
   - Verify preview URL is accessible

### Step 4: Test Release Workflow

1. **Merge the PR**:
   - Review and approve the PR
   - Merge to `main` branch

2. **Monitor Release Workflow**:
   - Go to `Actions` tab
   - Look for workflow triggered by merge to main
   - Verify these jobs run:
     - ✅ `test` - Build and test verification
     - ✅ `release` - Semantic release creation
     - ✅ `deploy-vercel` - Production deployment

3. **Expected Release Workflow Results**:
   ```
   ✅ Test and Build (same as PR)
   
   ✅ Create Release
     ├── Checkout code
     ├── Setup Node.js
     ├── Install dependencies
     ├── Download build artifacts
     └── Create Release (semantic-release)
   
   ✅ Deploy to Vercel
     ├── Checkout code
     ├── Setup Node.js
     ├── Install dependencies
     ├── Download build artifacts
     └── Deploy to Vercel (production)
   ```

### Step 5: Verify Release Creation

1. **Check GitHub Releases**:
   - Go to `Releases` section in your repository
   - Verify new release was created automatically
   - Check release notes are generated from commits

2. **Verify Version Bump**:
   ```bash
   git pull origin main
   cat package.json | grep version
   ```

3. **Check CHANGELOG.md**:
   ```bash
   cat CHANGELOG.md
   ```

### Step 6: Verify Vercel Deployment

1. **Check Vercel Dashboard**:
   - Go to your Vercel dashboard
   - Verify production deployment completed
   - Check deployment logs

2. **Test Live Application**:
   - Visit your production URL
   - Navigate to `/mobile-demo`
   - Test the new workflow test component

## 🔍 What to Look For

### ✅ Successful Indicators

1. **GitHub Actions**:
   - All workflow jobs complete with green checkmarks
   - No failed steps in any job
   - Artifacts are uploaded/downloaded correctly

2. **Semantic Release**:
   - New release appears in GitHub releases
   - Version number follows semantic versioning
   - Changelog is updated automatically
   - package.json version is bumped

3. **Vercel Deployment**:
   - Production deployment shows as successful
   - Preview deployments work for PRs
   - Application loads correctly on live URL

### ❌ Common Issues and Solutions

1. **Build Failures**:
   ```
   Issue: TypeScript errors or build failures
   Solution: Fix code issues locally first
   Command: npm run build && npm run type-check
   ```

2. **Missing Secrets**:
   ```
   Issue: Vercel deployment fails
   Solution: Add required GitHub secrets:
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID
   ```

3. **No Release Created**:
   ```
   Issue: Semantic release doesn't create release
   Solution: Check commit message format
   Required: feat:, fix:, or other conventional types
   ```

4. **Permission Errors**:
   ```
   Issue: GitHub Actions can't create releases
   Solution: Check repository permissions
   Required: Contents: write, Issues: write, Pull-requests: write
   ```

## 📊 Test Results Checklist

After running the test, verify:

- [ ] PR workflow runs successfully
- [ ] Preview deployment is created
- [ ] PR gets automated comment with deployment info
- [ ] Merge to main triggers release workflow
- [ ] New GitHub release is created automatically
- [ ] Version number is bumped correctly
- [ ] CHANGELOG.md is updated
- [ ] Production deployment to Vercel succeeds
- [ ] Live application works correctly

## 🎉 Success Criteria

Your GitHub Actions workflow is working correctly if:

1. **All jobs complete successfully** ✅
2. **Releases are created automatically** ✅
3. **Deployments work for both preview and production** ✅
4. **Version management is automated** ✅
5. **No manual intervention required** ✅

## 🔄 Continuous Testing

For ongoing verification:

1. **Regular commits** using conventional format
2. **Monitor workflow runs** in Actions tab
3. **Check deployment status** in Vercel dashboard
4. **Verify releases** are created as expected

## 📞 Troubleshooting

If you encounter issues:

1. **Check workflow logs** in GitHub Actions
2. **Verify secrets** are configured correctly
3. **Test locally** before pushing
4. **Review commit messages** for conventional format
5. **Check Vercel logs** for deployment issues

---

🎯 **Goal**: Fully automated CI/CD pipeline with zero manual intervention for releases and deployments!
