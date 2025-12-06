# Sushi World Mobile App

Mobile ordering app for Sushi World restaurant chain (Belgium).

**Client:** Sushi World  
**Agency:** Head of Vibe 2025  
**Project Type:** Mobile Application (React Native/Expo)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- Supabase account
- Foxy.io account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm start
```

## 📁 Project Structure

```
sushi-world-app/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation setup
│   ├── services/         # API services (Foxy, Supabase)
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── supabase/             # Supabase functions & migrations
└── assets/               # Images, fonts, etc.
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for required environment variables.

### Supabase Setup

1. Create a new Supabase project
2. Run migrations from `supabase/migrations/`
3. Set up Edge Functions for Foxy webhook and Webflow menu
4. Configure Row Level Security policies

### Webflow Setup (Menu Data)

1. Get Webflow API token from your account
2. Get site ID and collection IDs
3. Set Supabase secrets for Webflow credentials
4. Deploy the `webflow-menu` Edge Function

**See [WEBFLOW_SETUP.md](./WEBFLOW_SETUP.md) for detailed setup instructions.**

### Foxy.io Setup

1. Create OAuth client in Foxy admin
2. Configure webhook to point to Supabase Edge Function
3. Get store ID for Belgium

**See [FOXY_SETUP.md](./FOXY_SETUP.md) for detailed setup instructions.**

## 📱 Features

- ✅ Browse menu by categories
- ✅ Add items to cart
- ✅ Guest checkout
- ✅ Order history
- ✅ Loyalty points system
- ✅ QR code for in-store scanning
- ✅ Points redemption
- ✅ Push notifications
- ✅ User preferences

## 🛠️ Development

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Building for Production

```bash
# Build with EAS
eas build --platform ios
eas build --platform android
```

## 📚 Documentation

See project specification document for detailed architecture and implementation details.

## 👥 Collaboration & Development Workflow

This project is managed by **Head of Vibe 2025** agency. We use a collaborative workflow with code reviews.

### Starting New Work

```bash
# Always start from the latest main branch
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/what-im-building
# or
git checkout -b fix/bug-description
```

### Commit Message Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - CSS/UI changes (formatting, missing semi colons, etc.)
- `refactor:` - Code improvements without changing functionality
- `docs:` - Documentation updates
- `test:` - Adding or updating tests
- `chore:` - Config/setup changes, dependency updates
- `perf:` - Performance improvements

**Example:**
```bash
git commit -m "feat: add loyalty points redemption screen"
git commit -m "fix: resolve cart total calculation error"
git commit -m "style: update button colors to match design system"
```

### Creating a Pull Request

1. **Push your branch:**
   ```bash
   git add .
   git commit -m "feat: describe what you did"
   git push origin feature/your-branch-name
   ```

2. **Create Pull Request on GitHub:**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch to merge into `main`
   - Fill out the PR template
   - Assign your partner as a reviewer
   - Wait for approval before merging

3. **After Approval:**
   - Merge the PR (squash and merge recommended)
   - Delete the feature branch
   - Pull the latest `main` locally:
     ```bash
     git checkout main
     git pull origin main
     ```

### Branch Protection

The `main` branch is protected and requires:
- ✅ Pull request before merging
- ✅ At least 1 approval from a team member
- ✅ Passing CI/CD checks

This ensures code quality and collaboration.

## 🔐 Security Notes

- Never commit `.env` file
- Foxy API credentials should only be used server-side (Supabase Edge Functions)
- All Supabase tables have Row Level Security enabled

## 📄 License

Private - Sushi World / Head of Vibe 2025

## 📞 Contact

**Agency:** Head of Vibe 2025  
**Organization:** [Head-of-vibe-2025](https://github.com/Head-of-vibe-2025)

