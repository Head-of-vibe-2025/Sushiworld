# Setting Up GitHub Organization Repository

This guide will help you move your existing project to the **Head-of-vibe-2025** GitHub organization.

## Prerequisites

1. ✅ You've accepted the organization invite to `Head-of-vibe-2025`
2. ✅ You have the project name ready (format: `client-clientname-projecttype`)
3. ✅ You know your partner's GitHub username

## Step 1: Create the Repository on GitHub

**You need to do this manually on GitHub:**

1. Go to: https://github.com/organizations/Head-of-vibe-2025/repositories/new
2. Repository name: `[PROJECT_NAME]` (e.g., `client-sushiworld-mobileapp`)
3. Description: "Sushi World mobile ordering app"
4. Visibility: **Private** ✅
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Update Your Local Git Remote

After creating the repository, run these commands:

```bash
# Check current remote
git remote -v

# Remove old remote (if needed)
git remote remove origin

# Add new remote pointing to your organization
git remote add origin git@github.com:Head-of-vibe-2025/[PROJECT_NAME].git

# Verify the new remote
git remote -v

# Ensure you're on main branch
git checkout main

# Rename branch to main if needed (should already be main)
git branch -M main

# Push all your code to the new repository
git push -u origin main
```

**Note:** If you get authentication errors, make sure your SSH key is set up with GitHub, or use HTTPS:
```bash
git remote add origin https://github.com/Head-of-vibe-2025/[PROJECT_NAME].git
```

## Step 3: Commit and Push Template Files

After updating the remote, commit all the new template files:

```bash
# Stage all changes
git add .

# Commit the template files
git commit -m "chore: add project templates and CI/CD workflow"

# Push to the new repository
git push origin main
```

## Step 4: Set Up Branch Protection (Manual on GitHub)

1. Go to: `https://github.com/Head-of-vibe-2025/[PROJECT_NAME]/settings/branches`
2. Click **"Add branch protection rule"**
3. Branch name pattern: `main`
4. Enable these settings:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (set to 1)
   - ✅ **Dismiss stale pull request approvals when new commits are pushed**
   - ✅ **Require status checks to pass before merging** (optional, but recommended)
5. Click **"Create"**

This ensures all code is reviewed before merging to main!

## Step 5: Add Your Partner as Collaborator

1. Go to: `https://github.com/Head-of-vibe-2025/[PROJECT_NAME]/settings/access`
2. Click **"Add people"**
3. Search for your partner's GitHub username: `[PARTNER_USERNAME]`
4. Select role: **Write** (or **Admin** if they should manage settings)
5. Click **"Add [username] to this repository"**

## Step 6: Verify Everything Works

```bash
# Pull to make sure everything is synced
git pull origin main

# Create a test branch
git checkout -b test/setup-verification

# Make a small change (or just touch a file)
echo "# Setup Complete" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "test: verify GitHub setup"
git push origin test/setup-verification
```

Then:
1. Go to GitHub and create a Pull Request
2. Assign your partner as reviewer
3. After they approve, merge it
4. Delete the test branch

## Troubleshooting

### Authentication Issues

If you get permission errors:
- Make sure your SSH key is added to GitHub: https://github.com/settings/keys
- Or use HTTPS with a Personal Access Token: https://github.com/settings/tokens

### Remote Already Exists

If you see "remote origin already exists":
```bash
git remote set-url origin git@github.com:Head-of-vibe-2025/[PROJECT_NAME].git
```

### Push Rejected

If push is rejected:
```bash
# Force push (only if you're sure - be careful!)
git push -u origin main --force
```

## Next Steps

Once everything is set up:
1. ✅ Your partner can clone the repository
2. ✅ You can both create branches and collaborate
3. ✅ All PRs will require approval
4. ✅ CI/CD will run on every push

Happy coding! 🚀

