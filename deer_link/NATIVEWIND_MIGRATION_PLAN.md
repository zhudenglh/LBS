# NativeWind Migration Plan - XiaoLuYou App

## Executive Summary

This document outlines the comprehensive migration plan from React Native StyleSheet API to NativeWind (Tailwind CSS for React Native). The migration will enable us to use Tailwind CSS utility classes while maintaining all existing functionality.

## Table of Contents

1. [What is NativeWind](#what-is-nativewind)
2. [Why Migrate to NativeWind](#why-migrate-to-nativewind)
3. [Technology Stack Changes](#technology-stack-changes)
4. [Project Structure](#project-structure)
5. [Migration Phases](#migration-phases)
6. [Design Token Mapping](#design-token-mapping)
7. [Component Migration Strategy](#component-migration-strategy)
8. [File-by-File Migration Plan](#file-by-file-migration-plan)
9. [Testing Strategy](#testing-strategy)
10. [Rollback Plan](#rollback-plan)

---

## What is NativeWind

NativeWind is a universal styling system that brings Tailwind CSS to React Native. It allows you to use Tailwind's utility-first CSS classes directly in React Native components.

**Key Features:**
- Tailwind CSS utility classes in React Native
- Platform-specific variants (ios:, android:, web:)
- Dark mode support
- TypeScript support
- No runtime overhead (styles compiled at build time)

**Example:**
```tsx
// Before (StyleSheet)
<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold' }
});

// After (NativeWind)
<View className="flex-1 p-4">
  <Text className="text-lg font-bold">Hello</Text>
</View>
```

---

## Why Migrate to NativeWind

### Benefits

1. **Consistency with Figma Design**
   - Figma designs can be directly converted to Tailwind classes
   - Easier collaboration between designers and developers

2. **Faster Development**
   - No need to write StyleSheet.create() boilerplate
   - Utility-first approach speeds up styling
   - Rapid prototyping with pre-defined classes

3. **Better Maintainability**
   - All styling in component markup (co-location)
   - No need to manage separate style objects
   - Easier to understand component appearance at a glance

4. **Design System Consistency**
   - Tailwind's design tokens ensure consistency
   - Custom config for brand colors, spacing, etc.
   - No magic numbers scattered across files

5. **Smaller Bundle Size**
   - Unused styles are tree-shaken at build time
   - No runtime style computation overhead

6. **Better TypeScript Support**
   - Type-safe class names with autocomplete
   - Compile-time validation of utility classes

### Challenges

1. **Learning Curve**
   - Team needs to learn Tailwind utility classes
   - Different mental model from StyleSheet API

2. **Migration Effort**
   - All existing components need to be converted
   - Requires comprehensive testing

3. **Platform-Specific Styles**
   - Some React Native styles don't have Tailwind equivalents
   - May need custom utilities or inline styles

---

## Technology Stack Changes

### Before (Current)

```
React Native 0.73.2
├── StyleSheet API (built-in)
├── Manual color constants
├── Manual spacing constants
└── No utility classes
```

### After (With NativeWind)

```
React Native 0.73.2
├── NativeWind 4.x
├── Tailwind CSS 3.x
├── PostCSS
├── tailwind.config.js (design tokens)
└── Babel plugin for className transformation
```

### New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nativewind | ^4.0.0 | Main NativeWind library |
| tailwindcss | ^3.4.0 | Tailwind CSS core |
| react-native-css-interop | ^0.0.36 | CSS transformation engine |

---

## Project Structure

### Current Structure

```
deer_link/
├── src/
│   ├── constants/
│   │   └── theme.ts              # Color, spacing constants
│   ├── components/
│   │   └── **/*.tsx               # Components with StyleSheet
│   └── screens/
│       └── **/*.tsx               # Screens with StyleSheet
```

### New Structure (After Migration)

```
deer_link/
├── src/
│   ├── constants/
│   │   └── theme.ts              # Keep for non-visual constants (deprecated for colors/spacing)
│   ├── components/
│   │   └── **/*.tsx               # Components with className
│   ├── screens/
│   │   └── **/*.tsx               # Screens with className
│   └── styles/
│       └── global.css            # Global styles (if needed)
├── tailwind.config.js            # Tailwind configuration (NEW)
├── babel.config.js               # Updated with NativeWind plugin
├── metro.config.js               # Updated for CSS support
└── nativewind-env.d.ts           # TypeScript declarations (NEW)
```

---

## Migration Phases

### Phase 1: Setup & Configuration (Day 1)

**Goal:** Install NativeWind and configure all necessary tooling.

**Tasks:**
- [ ] Install NativeWind, Tailwind CSS, and dependencies
- [ ] Create `tailwind.config.js`
- [ ] Update `babel.config.js`
- [ ] Update `metro.config.js`
- [ ] Create TypeScript declaration file
- [ ] Test basic setup with a simple component

**Deliverable:** NativeWind working on a test component

---

### Phase 2: Design Token Migration (Day 1-2)

**Goal:** Map current design tokens to Tailwind config.

**Tasks:**
- [ ] Analyze `src/constants/theme.ts`
- [ ] Create Tailwind config with custom colors
- [ ] Create Tailwind config with custom spacing
- [ ] Create Tailwind config with custom font sizes
- [ ] Create Tailwind config with custom border radius
- [ ] Document token mapping

**Deliverable:** Complete Tailwind config with all design tokens

---

### Phase 3: Component Migration (Day 2-5)

**Goal:** Migrate all components from StyleSheet to NativeWind.

**Priority Order:**
1. **High Priority** (Day 2-3)
   - WiFi screen components (new design)
   - Common components (Button, Card, Avatar)
   - Home screen components

2. **Medium Priority** (Day 3-4)
   - Discover screen components
   - Profile screen components
   - Chat components

3. **Low Priority** (Day 4-5)
   - Favorite screen
   - Navigation components
   - Utility components

**Tasks per Component:**
- [ ] Convert StyleSheet to className
- [ ] Test functionality
- [ ] Test on iOS and Android
- [ ] Update tests if needed

---

### Phase 4: Testing & Bug Fixes (Day 5-6)

**Goal:** Comprehensive testing across all screens and platforms.

**Tasks:**
- [ ] Manual testing on Android
- [ ] Manual testing on iOS (if available)
- [ ] Test language switching (zh/en/id)
- [ ] Test dark mode (if implemented)
- [ ] Fix any styling bugs
- [ ] Performance testing

---

### Phase 5: Cleanup & Documentation (Day 6-7)

**Goal:** Remove old code and document changes.

**Tasks:**
- [ ] Remove unused `src/constants/theme.ts` exports
- [ ] Update README with NativeWind instructions
- [ ] Update CLAUDE.md with new patterns
- [ ] Create developer guide for NativeWind
- [ ] Remove old StyleSheet imports

---

## Design Token Mapping

### Color Mapping

| Current (theme.ts) | Tailwind Class | Custom Config |
|--------------------|----------------|---------------|
| `colors.primary` (#0285f0) | `bg-primary` | `primary: '#0285f0'` |
| `colors.secondary` (#FF5722) | `bg-secondary` | `secondary: '#FF5722'` |
| `colors.accent` (#FFD700) | `bg-accent` | `accent: '#FFD700'` |
| `colors.background` (#f6f8f7) | `bg-background` | `background: '#f6f8f7'` |
| `colors.white` (#FFFFFF) | `bg-white` | (built-in) |
| `colors.black` (#000000) | `bg-black` | (built-in) |
| `colors.border` (#E0E0E0) | `border-border` | `border: '#E0E0E0'` |
| `colors.text.primary` (#333333) | `text-text-primary` | `'text-primary': '#333333'` |
| `colors.text.secondary` (#666666) | `text-text-secondary` | `'text-secondary': '#666666'` |
| `colors.text.disabled` (#999999) | `text-text-disabled` | `'text-disabled': '#999999'` |
| `colors.status.success` (#4CAF50) | `bg-success` | `success: '#4CAF50'` |
| `colors.status.warning` (#FF9800) | `bg-warning` | `warning: '#FF9800'` |
| `colors.status.error` (#F44336) | `bg-error` | `error: '#F44336'` |

### Spacing Mapping

| Current (theme.ts) | Tailwind Class | Custom Config |
|--------------------|----------------|---------------|
| `spacing.xs` (4) | `p-1` | (built-in, 4px) |
| `spacing.sm` (8) | `p-2` | (built-in, 8px) |
| `spacing.md` (12) | `p-3` | (built-in, 12px) |
| `spacing.lg` (16) | `p-4` | (built-in, 16px) |
| `spacing.xl` (24) | `p-6` | (built-in, 24px) |
| `spacing.xxl` (32) | `p-8` | (built-in, 32px) |

### Font Size Mapping

| Current (theme.ts) | Tailwind Class | Custom Config |
|--------------------|----------------|---------------|
| `fontSize.xs` (10) | `text-xs` | (built-in, 12px) → Custom: 10px |
| `fontSize.sm` (12) | `text-sm` | (built-in, 14px) → Custom: 12px |
| `fontSize.md` (14) | `text-base` | (built-in, 16px) → Custom: 14px |
| `fontSize.lg` (16) | `text-lg` | (built-in, 18px) → Custom: 16px |
| `fontSize.xl` (18) | `text-xl` | (built-in, 20px) → Custom: 18px |
| `fontSize.xxl` (20) | `text-2xl` | (built-in, 24px) → Custom: 20px |
| `fontSize.xxxl` (24) | `text-3xl` | (built-in, 30px) → Custom: 24px |

### Border Radius Mapping

| Current (theme.ts) | Tailwind Class | Custom Config |
|--------------------|----------------|---------------|
| `borderRadius.sm` (4) | `rounded-sm` | (built-in, 2px) → Custom: 4px |
| `borderRadius.md` (8) | `rounded-md` | (built-in, 6px) → Custom: 8px |
| `borderRadius.lg` (12) | `rounded-lg` | (built-in, 8px) → Custom: 12px |
| `borderRadius.xl` (16) | `rounded-xl` | (built-in, 12px) → Custom: 16px |
| `borderRadius.round` (999) | `rounded-full` | (built-in, 9999px) |

### Shadow Mapping

React Native shadows need custom utilities:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'sm-rn': '0px 1px 2px rgba(0, 0, 0, 0.05)',
        'md-rn': '0px 2px 4px rgba(0, 0, 0, 0.1)',
        'lg-rn': '0px 4px 8px rgba(0, 0, 0, 0.15)',
      }
    }
  }
}
```

Usage:
```tsx
// Before
<View style={styles.card}>
const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});

// After
<View className="shadow-md-rn android:elevation-3">
```

---

## Component Migration Strategy

### Migration Pattern

```tsx
// BEFORE (StyleSheet)
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '@constants/theme';

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default MyComponent;
```

```tsx
// AFTER (NativeWind)
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-text-primary">Hello</Text>
    </View>
  );
}

export default MyComponent;
```

### Conversion Rules

#### Flexbox

| StyleSheet | NativeWind |
|------------|------------|
| `flex: 1` | `flex-1` |
| `flexDirection: 'row'` | `flex-row` |
| `flexDirection: 'column'` | `flex-col` |
| `justifyContent: 'center'` | `justify-center` |
| `alignItems: 'center'` | `items-center` |
| `flexWrap: 'wrap'` | `flex-wrap` |

#### Spacing

| StyleSheet | NativeWind |
|------------|------------|
| `padding: 16` | `p-4` |
| `paddingHorizontal: 16` | `px-4` |
| `paddingVertical: 16` | `py-4` |
| `paddingTop: 16` | `pt-4` |
| `margin: 16` | `m-4` |
| `marginBottom: 16` | `mb-4` |
| `gap: 16` | `gap-4` |

#### Sizing

| StyleSheet | NativeWind |
|------------|------------|
| `width: 100` | `w-[100px]` |
| `width: '100%'` | `w-full` |
| `height: 50` | `h-[50px]` |
| `minHeight: 100` | `min-h-[100px]` |
| `maxWidth: 500` | `max-w-[500px]` |

#### Colors & Backgrounds

| StyleSheet | NativeWind |
|------------|------------|
| `backgroundColor: colors.primary` | `bg-primary` |
| `color: colors.text.primary` | `text-text-primary` |
| `borderColor: colors.border` | `border-border` |

#### Typography

| StyleSheet | NativeWind |
|------------|------------|
| `fontSize: 18` | `text-xl` (custom 18px) |
| `fontWeight: 'bold'` | `font-bold` |
| `fontWeight: '600'` | `font-semibold` |
| `textAlign: 'center'` | `text-center` |
| `lineHeight: 24` | `leading-[24px]` |

#### Borders

| StyleSheet | NativeWind |
|------------|------------|
| `borderRadius: 8` | `rounded-md` (custom 8px) |
| `borderWidth: 1` | `border` |
| `borderTopWidth: 1` | `border-t` |
| `borderColor: '#ccc'` | `border-gray-300` |

#### Positioning

| StyleSheet | NativeWind |
|------------|------------|
| `position: 'absolute'` | `absolute` |
| `position: 'relative'` | `relative` |
| `top: 0` | `top-0` |
| `left: 10` | `left-[10px]` |
| `zIndex: 10` | `z-10` |

#### Platform-Specific

| StyleSheet | NativeWind |
|------------|------------|
| `Platform.select({ ios: {...}, android: {...} })` | `ios:bg-white android:bg-gray-100` |
| `Platform.OS === 'ios'` | `ios:rounded-lg` |

---

## File-by-File Migration Plan

### 1. Configuration Files

#### 1.1 `tailwind.config.js` (NEW)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0285f0',
        secondary: '#FF5722',
        accent: '#FFD700',
        background: '#f6f8f7',
        'gradient-start': '#0285f0',
        'gradient-end': '#f6f8f7',
        border: '#E0E0E0',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'text-disabled': '#999999',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
};
```

#### 1.2 `babel.config.js` (UPDATE)

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'nativewind/babel', // ADD THIS
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@types': './src/types',
          '@contexts': './src/contexts',
          '@api': './src/api',
          '@i18n': './src/i18n',
        },
      },
    ],
  ],
};
```

#### 1.3 `metro.config.js` (UPDATE)

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = mergeConfig(getDefaultConfig(__dirname), {
  // Your custom Metro config here
});

module.exports = withNativeWind(config, { input: './global.css' });
```

#### 1.4 `nativewind-env.d.ts` (NEW)

```typescript
/// <reference types="nativewind/types" />
```

#### 1.5 `tsconfig.json` (UPDATE)

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    // ... existing config
    "types": ["nativewind/types"] // ADD THIS
  },
  "include": [
    "nativewind-env.d.ts" // ADD THIS
  ]
}
```

#### 1.6 `global.css` (NEW - Optional)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 2. Component Migration Order

#### Priority 1: WiFi Tab Components (NEW DESIGN)

These are new components, so they should use NativeWind from the start:

1. **`src/components/wifi/WiFiConnectionCard.tsx`**
   - Lines: ~50
   - Complexity: Medium
   - Dependencies: None

2. **`src/components/wifi/QuickActionGrid.tsx`**
   - Lines: ~45
   - Complexity: Low
   - Dependencies: None

3. **`src/components/wifi/BusRouteCard.tsx`**
   - Lines: ~55
   - Complexity: Low
   - Dependencies: None

4. **`src/components/wifi/MerchantOfferCard.tsx`**
   - Lines: ~70
   - Complexity: Medium
   - Dependencies: Image handling

5. **`src/screens/WiFiScreen.tsx`**
   - Lines: ~180
   - Complexity: High
   - Dependencies: All WiFi components

#### Priority 2: Common Components

6. **`src/components/common/Button.tsx`**
   - Lines: ~80
   - Used by: Multiple screens
   - Critical: Yes

7. **`src/components/common/Card.tsx`**
   - Lines: ~50
   - Used by: Multiple screens
   - Critical: Yes

8. **`src/components/common/Avatar.tsx`**
   - Lines: ~60
   - Used by: Profile, Discover
   - Critical: No

9. **`src/components/common/Input.tsx`**
   - Lines: ~90
   - Used by: Forms
   - Critical: Yes

10. **`src/components/common/Tag.tsx`**
    - Lines: ~50
    - Used by: Posts
    - Critical: No

#### Priority 3: Home Screen

11. **`src/components/home/BusInfo.tsx`**
12. **`src/components/home/StationProgress.tsx`**
13. **`src/components/home/WiFiButton.tsx`**
14. **`src/components/home/EmergencyServices.tsx`**
15. **`src/components/home/NearbyRecommend.tsx`**
16. **`src/screens/HomeScreen.tsx`**

#### Priority 4: Discover Screen

17. **`src/components/posts/PostCard.tsx`**
18. **`src/components/posts/PostList.tsx`**
19. **`src/components/posts/PublishDialog.tsx`**
20. **`src/components/discover/TabSwitch.tsx`**
21. **`src/screens/DiscoverScreen.tsx`**

#### Priority 5: Profile Screen

22. **`src/components/profile/ProfileHeader.tsx`**
23. **`src/components/profile/StatsCard.tsx`**
24. **`src/components/profile/SettingItem.tsx`**
25. **`src/components/profile/LanguageSelector.tsx`**
26. **`src/screens/ProfileScreen.tsx`**

#### Priority 6: Chat Screen

27. **`src/components/chat/ChatBubble.tsx`**
28. **`src/components/chat/ChatInput.tsx`**
29. **`src/components/chat/ChatHistory.tsx`**
30. **`src/screens/AIChatScreen.tsx`**

#### Priority 7: Remaining Screens

31. **`src/screens/FavoriteScreen.tsx`**
32. **`src/screens/MyPostsScreen.tsx`**
33. **`src/navigation/MainNavigator.tsx`**

---

### 3. Migration Checklist Per Component

For each component, follow this checklist:

- [ ] **Step 1:** Read current component and understand styles
- [ ] **Step 2:** Create backup of file (git commit)
- [ ] **Step 3:** Remove StyleSheet import
- [ ] **Step 4:** Convert inline styles to className
- [ ] **Step 5:** Test component visually
- [ ] **Step 6:** Test component functionality
- [ ] **Step 7:** Test on Android (and iOS if available)
- [ ] **Step 8:** Update component tests (if any)
- [ ] **Step 9:** Code review
- [ ] **Step 10:** Commit changes

---

## Testing Strategy

### Manual Testing

#### Test Matrix

| Screen | Android | iOS | Chinese | English | Indonesian | Dark Mode |
|--------|---------|-----|---------|---------|------------|-----------|
| Home | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| Discover | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| WiFi | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| Favorite | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| Profile | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |
| AI Chat | ✓ | ✓ | ✓ | ✓ | ✓ | N/A |

#### Test Cases

**Visual Tests:**
1. All components render correctly
2. Colors match design tokens
3. Spacing matches design
4. Typography is correct
5. Borders and shadows are correct
6. Responsive behavior works

**Functional Tests:**
1. All buttons work
2. Form inputs accept text
3. Navigation works
4. Image uploads work
5. API calls work
6. State updates correctly

**Platform Tests:**
1. Android-specific styles work
2. iOS-specific styles work (if available)
3. Platform elevation/shadows work

**Internationalization Tests:**
1. All text in Chinese displays correctly
2. All text in English displays correctly
3. All text in Indonesian displays correctly
4. Language switching works

### Automated Testing

Update Jest tests to work with NativeWind:

```tsx
// Before
expect(element).toHaveStyle({ backgroundColor: '#fff' });

// After (may need custom matchers)
expect(element).toHaveClass('bg-white');
```

---

## Rollback Plan

### Backup Strategy

1. **Git Branching**
   - Create branch: `feature/nativewind-migration`
   - Keep `main` branch stable
   - Can revert entire migration if needed

2. **Incremental Commits**
   - Commit after each component migration
   - Easy to identify problematic changes

3. **Tag Current Version**
   ```bash
   git tag v1.0-pre-nativewind
   ```

### Rollback Procedure

If migration fails:

1. **Revert to Previous Commit**
   ```bash
   git reset --hard v1.0-pre-nativewind
   ```

2. **Uninstall NativeWind**
   ```bash
   npm uninstall nativewind tailwindcss
   ```

3. **Restore Configuration Files**
   - Restore `babel.config.js`
   - Restore `metro.config.js`
   - Remove `tailwind.config.js`

---

## Timeline & Milestones

### Week 1: Setup & WiFi Tab (Priority 1)

**Day 1:** Setup
- Install dependencies
- Configure Tailwind
- Configure Babel & Metro
- Test basic setup

**Day 2-3:** WiFi Tab
- Migrate all WiFi components
- Test WiFi screen thoroughly

### Week 2: Core Components (Priority 2-3)

**Day 4-5:** Common Components
- Button, Card, Input, Avatar, Tag

**Day 6-7:** Home Screen
- All Home components and screen

### Week 3: User-Facing Screens (Priority 4-5)

**Day 8-9:** Discover Screen
- Post components
- Discover screen

**Day 10-11:** Profile Screen
- Profile components
- Profile screen

### Week 4: Remaining & Testing (Priority 6-7)

**Day 12-13:** Chat & Others
- Chat components
- Favorite screen
- Navigation

**Day 14:** Final Testing & Cleanup

---

## Success Criteria

Migration is considered successful when:

- ✅ All components use NativeWind className
- ✅ No StyleSheet.create() in component files
- ✅ All screens render correctly on Android
- ✅ All screens render correctly on iOS (if tested)
- ✅ All languages (zh/en/id) work correctly
- ✅ No functionality is broken
- ✅ App performance is equal or better
- ✅ All tests pass
- ✅ Bundle size is equal or smaller
- ✅ Documentation is updated

---

## Resources & References

### Official Documentation
- [NativeWind Docs](https://www.nativewind.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Native Docs](https://reactnative.dev/docs/getting-started)

### Migration Guides
- [NativeWind v4 Migration](https://www.nativewind.dev/v4/getting-started/migration)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/best-practices)

### Community Resources
- [NativeWind Discord](https://discord.gg/nativewind)
- [Tailwind CSS Discord](https://discord.gg/tailwindcss)

---

## Appendix A: Common Patterns

### Pattern 1: Conditional Styles

```tsx
// Before
<View style={[
  styles.button,
  isActive && styles.buttonActive,
  isDisabled && styles.buttonDisabled
]}>

// After
<View className={`
  px-4 py-2 rounded-lg
  ${isActive ? 'bg-primary' : 'bg-gray-200'}
  ${isDisabled ? 'opacity-50' : 'opacity-100'}
`}>
```

### Pattern 2: Dynamic Values

```tsx
// Before
<View style={{ marginTop: offset }}>

// After (use inline style for truly dynamic values)
<View style={{ marginTop: offset }} className="bg-white p-4">
```

### Pattern 3: Platform-Specific Styles

```tsx
// Before
<View style={Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1 },
  android: { elevation: 3 }
})}>

// After
<View className="ios:shadow-md android:elevation-3">
```

### Pattern 4: Responsive Design

```tsx
// After (with custom breakpoints)
<View className="w-full md:w-1/2 lg:w-1/3">
```

---

## Appendix B: Troubleshooting

### Issue 1: Styles Not Applying

**Symptom:** className has no effect

**Solution:**
1. Check Metro is running with NativeWind
2. Verify `babel.config.js` has NativeWind plugin
3. Clear Metro cache: `npm start -- --reset-cache`
4. Rebuild app

### Issue 2: TypeScript Errors on className

**Symptom:** TypeScript complains about className prop

**Solution:**
1. Check `nativewind-env.d.ts` exists
2. Verify it's included in `tsconfig.json`
3. Restart TypeScript server in IDE

### Issue 3: Colors Not Working

**Symptom:** Custom colors not applied

**Solution:**
1. Check `tailwind.config.js` has correct color definitions
2. Verify color names match exactly
3. Restart Metro bundler

### Issue 4: Platform-Specific Styles Not Working

**Symptom:** `ios:` or `android:` prefix has no effect

**Solution:**
1. Ensure NativeWind v4 is installed
2. Check platform detection is working
3. Use fallback styles

---

## Appendix C: Performance Optimization

### Best Practices

1. **Use Built-in Classes When Possible**
   - `p-4` instead of `p-[16px]`
   - Reduces CSS bundle size

2. **Avoid Overly Complex className Strings**
   - Extract to constants if needed
   - Use helper functions for complex logic

3. **Minimize Arbitrary Values**
   - `w-[123px]` increases bundle size
   - Define common values in tailwind.config.js

4. **Use PurgeCSS (Automatic in Tailwind)**
   - Unused classes are removed at build time
   - No action needed

---

## Conclusion

This migration plan provides a comprehensive roadmap for transitioning from React Native StyleSheet to NativeWind. By following this plan systematically, we can achieve a more maintainable, consistent, and developer-friendly codebase while maintaining all existing functionality.

**Next Steps:**
1. Review this plan with the team
2. Get approval from stakeholders
3. Create GitHub issues for each phase
4. Begin Phase 1: Setup & Configuration

**Questions? Contact:**
- Technical Lead: [Your Name]
- Project Manager: [PM Name]
