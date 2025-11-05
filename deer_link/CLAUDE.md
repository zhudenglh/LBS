# CLAUDE.md - XiaoLuYou React Native App

This file provides guidance to Claude Code (claude.ai/code) when working with this React Native cross-platform mobile application.

## Project Overview

**XiaoLuYou (小路游)** is a React Native-based cross-platform mobile application for public transit social networking, focused on the Nanjing bus system. It supports iOS and Android with a single codebase.

### Key Features

1. **Home Tab** - Transit information, WiFi connection, emergency services, nearby recommendations
2. **Discover Tab** - Community posts, publish content, like/comment, nearby people
3. **WiFi Tab** - Available WiFi networks and merchant information
4. **Favorite Tab** - Saved offers and promotions
5. **Profile Tab** - User profile, posts, collections, settings
6. **AI Assistant** - "JinLing Miao" chatbot for local recommendations

### Tech Stack

- **Framework**: React Native 0.73+
- **Language**: TypeScript 5.0+
- **Navigation**: React Navigation 6.x
- **State Management**: React Context API + Hooks
- **I18n**: react-i18next
- **HTTP Client**: Axios
- **Image Upload**: react-native-image-picker
- **Backend**: Node.js + Express + Alibaba Cloud (OSS, Tablestore)

## Project Structure

```
deer_link/
├── src/
│   ├── api/                    # API clients
│   │   ├── client.ts           # Axios instance configuration
│   │   ├── posts.ts            # Post-related APIs
│   │   ├── images.ts           # Image upload APIs
│   │   └── ai.ts               # AI chat APIs
│   ├── components/             # Reusable components
│   │   ├── common/             # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Avatar.tsx
│   │   ├── posts/              # Post-related components
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── PublishDialog.tsx
│   │   └── chat/               # Chat components
│   │       ├── ChatBubble.tsx
│   │       └── ChatInput.tsx
│   ├── screens/                # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── DiscoverScreen.tsx
│   │   ├── WiFiScreen.tsx
│   │   ├── FavoriteScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/             # Navigation configuration
│   │   └── MainNavigator.tsx
│   ├── contexts/               # React contexts
│   │   ├── UserContext.tsx     # User state management
│   │   └── ThemeContext.tsx    # Theme configuration
│   ├── i18n/                   # Internationalization
│   │   ├── index.ts            # i18n configuration
│   │   ├── locales/
│   │   │   ├── en.json         # English translations
│   │   │   ├── zh.json         # Chinese translations
│   │   │   └── id.json         # Indonesian translations
│   ├── types/                  # TypeScript types
│   │   ├── api.ts              # API response types
│   │   ├── post.ts             # Post data types
│   │   └── user.ts             # User data types
│   ├── utils/                  # Utility functions
│   │   ├── storage.ts          # AsyncStorage wrapper
│   │   ├── time.ts             # Time formatting
│   │   └── validator.ts        # Input validation
│   ├── constants/              # App constants
│   │   ├── api.ts              # API endpoints
│   │   └── theme.ts            # Theme colors & styles
│   └── App.tsx                 # Root component
├── android/                    # Android native code
├── ios/                        # iOS native code
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

## Development Commands

### Installation

```bash
# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..
```

### Development

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run TypeScript compiler in watch mode
npm run tsc
```

### Build

```bash
# Android debug build
npm run android:build

# Android release build
cd android && ./gradlew assembleRelease

# iOS build (macOS only, requires Xcode)
npm run ios:build
```

### Testing & Linting

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture Principles

### 1. Component Size Limits

- **Maximum 200 lines per component** - Split larger components into smaller ones
- Use custom hooks to extract complex logic
- Separate UI logic from business logic

### 2. No Hardcoded Strings

- **All user-facing text must use i18n** - `t('key')` from react-i18next
- Keep translation keys organized by feature
- Use interpolation for dynamic content: `t('greeting', { name: 'User' })`

### 3. Type Safety

- All API responses must have TypeScript interfaces
- Use strict mode in `tsconfig.json`
- Avoid `any` type - use `unknown` or proper types

### 4. State Management

- Use React Context for global state (user, theme)
- Use local state (useState) for component-specific data
- Use useReducer for complex state logic

### 5. Code Organization

- One component per file
- Group related components in directories
- Barrel exports (index.ts) for clean imports

## Internationalization (i18n)

### Setup

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';
import id from './locales/id.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    id: { translation: id }
  },
  lng: 'zh',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <Text>{t('welcome_message')}</Text>
    <Text>{t('greeting', { name: userName })}</Text>
  );
}
```

### Translation File Structure

```json
{
  "common": {
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save"
  },
  "home": {
    "title": "Home",
    "wifi_connect": "Connect to WiFi"
  },
  "post": {
    "publish": "Publish",
    "title_empty": "Title cannot be empty"
  }
}
```

## API Integration

### Backend Endpoints

Base URL: `http://101.37.70.167:3000/api`

- `POST /upload-image` - Upload image to Alibaba Cloud OSS
- `POST /posts` - Create new post
- `GET /posts?userId={userId}` - Get posts (with like status for user)
- `POST /posts/like` - Like a post
- `POST /posts/unlike` - Unlike a post
- `POST /ai/chat` - AI chatbot conversation

### API Client Setup

```typescript
// src/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Example API Usage

```typescript
// src/api/posts.ts
import { apiClient } from './client';
import { Post, CreatePostRequest } from '../types/api';

export async function createPost(data: CreatePostRequest): Promise<{ postId: string }> {
  const response = await apiClient.post('/posts', data);
  return response.data;
}

export async function getPosts(userId: string): Promise<Post[]> {
  const response = await apiClient.get('/posts', { params: { userId } });
  return response.data.posts;
}
```

## User Management

### User Context

```typescript
// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  userId: string;
  nickname: string;
  avatar: string;
  updateProfile: (nickname: string, avatar: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Implementation
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
```

## Styling Guidelines

### Theme System

```typescript
// src/constants/theme.ts
export const colors = {
  primary: '#2196F3',
  secondary: '#FF5722',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999'
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24
};
```

### StyleSheet Usage

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md
  }
});
```

## Platform-Specific Code

Use Platform API for platform-specific implementations:

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  }
});
```

## Image Upload Flow

```typescript
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadImage } from '../api/images';

async function handleImagePick() {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8
  });

  if (result.assets && result.assets[0]) {
    const imageUrl = await uploadImage(result.assets[0]);
    return imageUrl;
  }
}
```

## Performance Optimization

1. **Use React.memo** for components that don't change often
2. **Use useCallback** for event handlers passed to child components
3. **Use useMemo** for expensive calculations
4. **FlatList instead of ScrollView** for long lists
5. **Image optimization** - Use FastImage library for better caching

## Testing Strategy

### Unit Tests

```typescript
// __tests__/utils/time.test.ts
import { formatTimeAgo } from '../../src/utils/time';

describe('formatTimeAgo', () => {
  it('should return "just now" for recent timestamps', () => {
    const now = Date.now();
    expect(formatTimeAgo(now)).toBe('time_just_now');
  });
});
```

### Component Tests

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Common Pitfalls & Solutions

### 1. Android Back Button

```typescript
import { BackHandler } from 'react-native';

useEffect(() => {
  const backAction = () => {
    // Handle back button
    return true; // Prevent default behavior
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  return () => backHandler.remove();
}, []);
```

### 2. Safe Area on iOS

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
    </SafeAreaView>
  );
}
```

### 3. Keyboard Avoiding

```typescript
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
  {/* Content */}
</KeyboardAvoidingView>
```

## Deployment

### Android APK

```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA (macOS only)

1. Open `ios/XiaoLuYou.xcworkspace` in Xcode
2. Select "Product" > "Archive"
3. Distribute app via App Store Connect or Ad Hoc

## Environment Configuration

```bash
# .env file (not committed to git)
API_BASE_URL=http://101.37.70.167:3000/api
ENVIRONMENT=production
```

```typescript
// src/constants/api.ts
import Config from 'react-native-config';

export const API_BASE_URL = Config.API_BASE_URL || 'http://101.37.70.167:3000/api';
```

## Security Considerations

1. **No hardcoded secrets** - Use environment variables
2. **Validate all user input** - Client-side validation for UX, server-side for security
3. **HTTPS only in production** - Enforce secure connections
4. **AsyncStorage encryption** - Use react-native-encrypted-storage for sensitive data
5. **Image size limits** - Validate before upload (max 10MB per image)

## Migration from Java Android App

The original HelloWorldApp was a Java-based Android app. Key differences:

| Original (Java/Android) | New (React Native) |
|------------------------|-------------------|
| Single platform (Android) | Cross-platform (iOS + Android) |
| Hardcoded Chinese strings | i18n support (zh/en/id) |
| 3787 lines MainActivity.java | Max 200 lines per component |
| Native Android APIs | React Native APIs |
| XML layouts | JSX/TSX components |

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [react-i18next](https://react.i18next.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For issues related to:
- **Backend API**: Contact backend team or check ChuxingbaoBackend/README.md
- **React Native setup**: See React Native environment setup guide
- **Translation updates**: Edit files in `src/i18n/locales/`
