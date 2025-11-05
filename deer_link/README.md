# XiaoLuYou (小路游) - React Native App

A cross-platform mobile application for public transit social networking, focused on the Nanjing bus system.

## 🎯 Features

- 📱 **Cross-platform** - Single codebase for iOS and Android
- 🌍 **Multi-language** - Chinese, English, Indonesian
- 🚌 **Transit Info** - Real-time bus information
- 📝 **Social Posts** - Share your travel stories
- 🤖 **AI Assistant** - JinLing Miao chatbot
- 📶 **WiFi Connect** - Quick bus WiFi connection
- 🆘 **Emergency Services** - Find nearby toilets, stores, pharmacies, banks

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- React Native development environment
- For iOS: macOS with Xcode
- For Android: Android Studio

### Installation

```bash
# Clone the repository
cd /Users/lihua/claude/LBS/deer_link

# Install dependencies
npm install

# iOS only - Install pods
cd ios && pod install && cd ..
```

### Running

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## 📁 Project Structure

```
deer_link/
├── src/
│   ├── api/            # API client and endpoints
│   ├── components/     # Reusable UI components
│   ├── constants/      # Theme, config, API constants
│   ├── contexts/       # React contexts (User, Theme)
│   ├── i18n/           # Internationalization
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── App.tsx         # Root component
├── android/            # Android native code
├── ios/                # iOS native code
└── package.json
```

## 🌐 Internationalization

The app supports 3 languages:
- 🇨🇳 Chinese (zh) - Default
- 🇬🇧 English (en)
- 🇮🇩 Indonesian (id)

All text uses react-i18next. Translation files are in `src/i18n/locales/`.

## 🎨 Design System

- **Colors**: Primary blue (#2196F3), Secondary orange (#FF5722)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 4px, 8px, 12px, 16px, 24px, 32px
- **Components**: All follow 200-line limit, modular design

## 🔌 Backend API

Base URL: `http://101.37.70.167:3000/api`

Endpoints:
- `POST /upload-image` - Upload images
- `POST /posts` - Create post
- `GET /posts` - Get posts
- `POST /posts/like` - Like post
- `POST /posts/unlike` - Unlike post
- `POST /ai/chat` - AI chatbot

## 📦 Main Dependencies

- **react-native**: 0.73.2
- **react-navigation**: ^6.x
- **axios**: ^1.6.5
- **i18next**: ^23.7.16
- **react-i18next**: ^14.0.0
- **@react-native-async-storage/async-storage**: ^1.21.0

## 🛠️ Development

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run tsc

# Run tests
npm test
```

## 📝 Code Guidelines

1. **File size**: Maximum 200 lines per file
2. **No hardcoded strings**: Use i18n for all text
3. **Type safety**: Use TypeScript strictly
4. **Naming**: camelCase for variables, PascalCase for components
5. **Imports**: Use path aliases (@components, @api, etc.)

## 🔄 Migration from Java Android App

This is a refactored version of the original Java Android app:
- Original: 3787-line MainActivity.java
- New: 40+ modular files, each < 200 lines
- Added: iOS support, internationalization, TypeScript

## 📄 License

Private project for internal use.

## 👥 Team

Developed by the ChuxingbaoBackend team.

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guide for Claude Code
- [REFACTORING_PLAN.md](./REFACTORING_PLAN.md) - Complete refactoring plan
- [GENERATED_FILES.md](./GENERATED_FILES.md) - List of all files and generation status

---

**Current Status**: 53% complete - Core infrastructure ready, additional screens and components in progress.
