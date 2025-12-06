# Setting Up GitHub Organization Repository

This guide will help you move your existing project to the **Head-of-vibe-2025** GitHub organization.

## Prerequisites

1. ✅ You've accepted the organization invite to `Head-of-vibe-2025`
2. ✅ You have the project name ready (format: `client-clientname-projecttype`)
3. ✅ You know your partner's GitHub username

## Step 1: Create the Repository on GitHub

✅ **COMPLETED** - Repository created: `Sushiworld`

## Step 2: Update Your Local Git Remote

✅ **COMPLETED** - Remote updated to: `https://github.com/Head-of-vibe-2025/Sushiworld.git`

## Step 3: Commit and Push Template Files

✅ **COMPLETED** - All template files committed and pushed to main branch

## Step 4: Set Up Branch Protection (Manual on GitHub)

1. Go to: `https://github.com/Head-of-vibe-2025/Sushiworld/settings/branches`
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

1. Go to: `https://github.com/Head-of-vibe-2025/Sushiworld/settings/access`
2. Click **"Add people"**
3. Search for your partner's GitHub username
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

