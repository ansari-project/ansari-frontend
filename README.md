# Ansari Chat - AI-Powered Islamic Knowledge Assistant

<div align="center">
  <img src="./src/assets/images/icon.png" alt="Ansari Chat Logo" width="150"/>
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.76.7-blue)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-SDK%2052-black)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
</div>

## 📖 Overview

Ansari Chat is a cross-platform mobile and web application that provides an AI-powered Islamic knowledge assistant. Built with React Native and Expo, it offers users an intuitive chat interface to ask questions about Islamic teachings, practices, and guidance.

## ✨ Features

- **AI Chat Interface**: Interactive conversation with an Islamic knowledge assistant
- **Multi-language Support**: Internationalization with i18next
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Thread Management**: Organize conversations in separate threads
- **Share Functionality**: Share conversations with others
- **User Authentication**: Secure login and registration system
- **Guest Mode**: Try the app without creating an account
- **Dark/Light Theme**: Automatic theme switching based on device settings
- **Markdown Support**: Rich text formatting in chat messages
- **RTL Support**: Full support for Arabic and other RTL languages

## 🛠️ Tech Stack

### Core Technologies
- **React Native 0.76.7** - Mobile framework
- **Expo SDK 52** - Development platform
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **NativeWind** - Tailwind CSS for React Native

### Key Libraries
- **expo-router** - File-based routing
- **react-i18next** - Internationalization
- **react-native-reanimated** - Smooth animations
- **react-native-gesture-handler** - Touch gestures
- **react-native-markdown-display** - Markdown rendering
- **@sentry/react-native** - Error tracking
- **@vercel/analytics** - Web analytics
- **formik & yup** - Form handling and validation

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android emulator
- EAS CLI for building (`npm install -g eas-cli`)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ansari-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_API_V2_URL=https://your-api-url/api/v2
EXPO_PUBLIC_API_TIMEOUT=60000
EXPO_PUBLIC_SHARE_URL=http://localhost:8081
EXPO_PUBLIC_SUBSCRIBE_URL=your-subscribe-url
EXPO_PUBLIC_FEEDBACK_EMAIL=feedback@yourdomain.com
EXPO_PUBLIC_COMPREHENSIVE_GUIDE_URL=https://docs.yourdomain.com/capabilities/
EXPO_PUBLIC_PRIVACY_URL=https://docs.yourdomain.com/privacy/
EXPO_PUBLIC_TERMS_URL=https://docs.yourdomain.com/terms/
EXPO_PUBLIC_ENABLE_SHARE=false
```

### Development

Start the development server:
```bash
npm start
# or with cache clear
npm run start:clear
```

Run on specific platforms:
```bash
npm run ios          # iOS Simulator
npm run android      # Android Emulator
npm run web          # Web browser
```

Run on physical devices:
```bash
npm run ios:device
npm run android:device
```

## 📦 Building

### Development Build
```bash
npm run build:development
```

### Preview Build
```bash
npm run build:preview
```

### Production Build
```bash
npm run build:production
```

### Platform-specific builds:
```bash
npm run android:preview   # Android preview APK
npm run ios:preview       # iOS preview build
```

## 🧪 Code Quality

### Linting
```bash
npm run lint                    # Check all files
npx eslint [file-path]          # Check specific file
npx eslint [file-path] --fix    # Auto-fix issues
```

### Code Style
The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Custom lint rules (see `.eslintrc.js`)

## 📱 Project Structure

```
ansari-frontend/
├── src/
│   ├── app/                   # Expo Router pages
│   │   ├── (app)/             # Authenticated routes
│   │   ├── (public)/          # Public routes
│   │   ├── share/             # Share functionality
│   │   └── welcome/           # Onboarding
│   ├── assets/                # Images, fonts, etc.
│   ├── components/            # Reusable components
│   │   ├── buttons/           # Button components
│   │   ├── chat/              # Chat-related components
│   │   ├── menu/              # Menu components
│   │   ├── prompts/           # Prompt components
│   │   ├── share/             # Share components
│   │   ├── svg/               # SVG icon components
│   │   └── threads/           # Thread management
│   ├── constants/             # App constants
│   ├── hooks/                 # Custom React hooks
│   ├── i18n/                  # Internationalization
│   ├── services/              # API services
│   ├── store/                 # Redux store
│   │   ├── actions/           # Redux actions
│   │   ├── slices/            # Redux slices
│   │   └── types/             # TypeScript types
│   ├── styles/                # Global styles
│   └── utils/                 # Utility functions
├── public/                    # Static assets (web)
├── config/                    # Configuration files
└── docs/                      # Documentation
```

## 🌐 API Integration

The app connects to a backend API for:
- User authentication
- Chat conversations
- Thread management
- User preferences
- Feedback submission

API configuration is managed through environment variables.

## 📲 Deployment

### Web Deployment (Vercel)
```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

### Mobile Deployment

#### Android
1. Build APK/AAB:
```bash
npm run android:release
```

2. Submit to Google Play:
```bash
eas submit -p android
```

#### iOS
1. Build IPA:
```bash
npm run ios:release
```

2. Submit to App Store:
```bash
eas submit -p ios
```

## 🔄 OTA Updates

Deploy over-the-air updates:
```bash
npm run update:development   # Development channel
npm run update:preview       # Preview channel
npm run update:production    # Production channel
```

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run linting: `npm run lint`
4. Test on multiple platforms
5. Create a pull request to `develop`

## 📄 Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines including:
- Code style requirements
- Git workflow
- Build commands
- Common patterns

## 🐛 Debugging

- Use React Native Debugger for debugging
- Sentry integration for error tracking in production
- Console logs visible in Metro bundler terminal

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by Ansari Project Team
</div>
