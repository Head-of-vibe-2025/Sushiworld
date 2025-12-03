# Sushi World Mobile App

Mobile ordering app for Sushi World restaurant chain (Belgium).

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

## 🔐 Security Notes

- Never commit `.env` file
- Foxy API credentials should only be used server-side (Supabase Edge Functions)
- All Supabase tables have Row Level Security enabled

## 📄 License

Private - Sushi World

