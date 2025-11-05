# HelloWorldApp to React Native Refactoring Plan

## Executive Summary

This document outlines the comprehensive refactoring plan to migrate the HelloWorldApp from a native Android application (Java) to a cross-platform React Native application supporting both iOS and Android.

## Goals

1. **Cross-platform support**: Single codebase for iOS and Android
2. **Internationalization**: No hardcoded Chinese strings, support zh/en/id languages
3. **Code quality**: Max 900 lines per file, modular architecture
4. **Maintainability**: TypeScript for type safety, clear component structure
5. **Feature parity**: All existing features preserved and enhanced

## Current State Analysis

### Existing Android App Structure

```
HelloWorldApp (Java/Android)
├── MainActivity.java (3787 lines) ⚠️ Too large
├── HomeTabManager.java (494 lines)
├── DiscoverTabManager.java
├── ProfileTabManager.java
├── WiFiTabManager.java
├── AIChatManager.java
├── DialogManager.java
├── UserManager.java
├── ApiClient.java (360 lines)
└── Supporting classes
```

### Problems Identified

1. **Platform limitation**: Android-only, no iOS support
2. **Hardcoded strings**: All UI text in Chinese within Java code
3. **Large files**: MainActivity.java is 3787 lines (violates 2000 line limit)
4. **Tight coupling**: UI and business logic mixed
5. **No type safety**: Java with minimal type checking
6. **Difficult testing**: Monolithic structure hard to test

### Key Features to Migrate

#### Home Tab
- Bus route information with station progress
- WiFi connection button
- Emergency services (toilet, store, pharmacy, bank)
- Nearby recommendations (food, fun, scenic spots)
- AI chat assistant "JinLing Miao"

#### Discover Tab
- Community posts feed with images
- Publish new posts with image upload
- Like/unlike functionality
- "Look around" vs "Nearby people" tabs
- Pull-to-refresh

#### WiFi Tab
- Available WiFi networks list
- Merchant information
- Quick connect functionality

#### Favorite Tab
- Saved offers and promotions

#### Profile Tab
- User profile (avatar, nickname, user ID)
- Post count, like count, collection count
- My posts
- Edit profile
- Language settings

## Target Architecture

### Technology Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | React Native 0.73 | Cross-platform support, large ecosystem |
| Language | TypeScript 5.0 | Type safety, better developer experience |
| Navigation | React Navigation 6 | Standard RN navigation solution |
| State Management | Context API + Hooks | Built-in, no external dependency needed |
| I18n | react-i18next | Industry standard, flexible |
| HTTP Client | Axios | Promise-based, interceptor support |
| Storage | AsyncStorage | React Native official solution |
| Image Picker | react-native-image-picker | Native gallery access |

### Directory Structure

```
deer_link/
├── src/
│   ├── api/                        # API layer (max 150 lines/file)
│   │   ├── client.ts               # Axios configuration
│   │   ├── posts.ts                # Post CRUD operations
│   │   ├── images.ts               # Image upload
│   │   ├── ai.ts                   # AI chat
│   │   └── users.ts                # User management
│   │
│   ├── components/                 # Reusable components (max 200 lines/file)
│   │   ├── common/                 # Generic UI components
│   │   │   ├── Avatar.tsx          # User avatar display (60 lines)
│   │   │   ├── Button.tsx          # Custom button (80 lines)
│   │   │   ├── Card.tsx            # Content card (70 lines)
│   │   │   ├── Input.tsx           # Text input (90 lines)
│   │   │   ├── Tag.tsx             # Label/tag component (50 lines)
│   │   │   ├── EmptyState.tsx      # Empty list placeholder (60 lines)
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── posts/                  # Post-related components
│   │   │   ├── PostCard.tsx        # Single post display (150 lines)
│   │   │   ├── PostList.tsx        # List of posts (120 lines)
│   │   │   ├── PublishDialog.tsx   # Post creation modal (180 lines)
│   │   │   ├── ImagePicker.tsx     # Multi-image selector (140 lines)
│   │   │   ├── BusSelector.tsx     # Bus line selector (130 lines)
│   │   │   └── index.ts
│   │   │
│   │   ├── chat/                   # Chat components
│   │   │   ├── ChatBubble.tsx      # Message bubble (80 lines)
│   │   │   ├── ChatInput.tsx       # Message input (100 lines)
│   │   │   ├── ChatHistory.tsx     # Message list (110 lines)
│   │   │   └── index.ts
│   │   │
│   │   ├── home/                   # Home screen components
│   │   │   ├── BusInfo.tsx         # Bus route display (120 lines)
│   │   │   ├── StationProgress.tsx # Station timeline (180 lines)
│   │   │   ├── WiFiButton.tsx      # WiFi connection (90 lines)
│   │   │   ├── EmergencyServices.tsx # Emergency tabs (160 lines)
│   │   │   ├── NearbyRecommend.tsx # Recommendations (180 lines)
│   │   │   └── index.ts
│   │   │
│   │   ├── discover/               # Discover screen components
│   │   │   ├── TabSwitch.tsx       # Look around / Nearby people (70 lines)
│   │   │   ├── NearbyPeopleCard.tsx # User card (110 lines)
│   │   │   └── index.ts
│   │   │
│   │   ├── wifi/                   # WiFi screen components
│   │   │   ├── WiFiListItem.tsx    # WiFi network item (90 lines)
│   │   │   ├── MerchantCard.tsx    # Merchant info (100 lines)
│   │   │   └── index.ts
│   │   │
│   │   └── profile/                # Profile components
│   │       ├── ProfileHeader.tsx   # Avatar + nickname (120 lines)
│   │       ├── StatsCard.tsx       # Posts/likes stats (80 lines)
│   │       ├── SettingItem.tsx     # Setting row (60 lines)
│   │       └── index.ts
│   │
│   ├── screens/                    # Screen components (max 200 lines/file)
│   │   ├── HomeScreen.tsx          # (180 lines)
│   │   ├── DiscoverScreen.tsx      # (160 lines)
│   │   ├── WiFiScreen.tsx          # (140 lines)
│   │   ├── FavoriteScreen.tsx      # (120 lines)
│   │   ├── ProfileScreen.tsx       # (170 lines)
│   │   ├── MyPostsScreen.tsx       # (130 lines)
│   │   ├── AIChatScreen.tsx        # (150 lines)
│   │   └── index.ts
│   │
│   ├── navigation/                 # Navigation setup
│   │   ├── MainNavigator.tsx       # Tab navigator
│   │   ├── types.ts                # Navigation types
│   │   └── index.ts
│   │
│   ├── contexts/                   # Global state
│   │   ├── UserContext.tsx         # User info & auth (160 lines)
│   │   ├── ThemeContext.tsx        # Theme settings (100 lines)
│   │   └── index.ts
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useUser.ts              # User operations (120 lines)
│   │   ├── usePosts.ts             # Post CRUD (150 lines)
│   │   ├── useImageUpload.ts       # Image upload logic (90 lines)
│   │   ├── useAIChat.ts            # AI chat logic (130 lines)
│   │   └── index.ts
│   │
│   ├── i18n/                       # Internationalization
│   │   ├── index.ts                # i18n configuration
│   │   └── locales/
│   │       ├── en.json             # English
│   │       ├── zh.json             # Simplified Chinese
│   │       └── id.json             # Indonesian
│   │
│   ├── types/                      # TypeScript definitions
│   │   ├── api.ts                  # API request/response types
│   │   ├── post.ts                 # Post data types
│   │   ├── user.ts                 # User data types
│   │   ├── chat.ts                 # Chat message types
│   │   └── index.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── storage.ts              # AsyncStorage wrapper
│   │   ├── time.ts                 # Time formatting
│   │   ├── validator.ts            # Input validation
│   │   ├── avatar.ts               # Avatar generation
│   │   └── index.ts
│   │
│   ├── constants/                  # App constants
│   │   ├── api.ts                  # API endpoints
│   │   ├── theme.ts                # Colors, spacing
│   │   ├── config.ts               # App configuration
│   │   └── index.ts
│   │
│   └── App.tsx                     # Root component (100 lines)
│
├── android/                        # Android native code
├── ios/                            # iOS native code
├── __tests__/                      # Test files
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── .gitignore
```

## Component Breakdown Strategy

### Principle: Single Responsibility

Each component should have ONE clear purpose and be <= 200 lines.

### Breaking Down MainActivity.java (3787 lines → 40+ files)

**Original Structure:**
```
MainActivity.java (3787 lines)
├── Emergency services logic - 200 lines
├── Nearby recommendations - 500 lines
├── Post management - 600 lines
├── AI chat - 300 lines
├── Profile & user management - 400 lines
├── WiFi connection - 200 lines
├── Dialog management - 500 lines
└── Helper methods - 1087 lines
```

**New Modular Structure:**

```
7 Screens (each ~150 lines):
├── HomeScreen.tsx (180 lines)
├── DiscoverScreen.tsx (160 lines)
├── WiFiScreen.tsx (140 lines)
├── FavoriteScreen.tsx (120 lines)
├── ProfileScreen.tsx (170 lines)
├── MyPostsScreen.tsx (130 lines)
└── AIChatScreen.tsx (150 lines)

25+ Components (each ~50-180 lines):
├── PostCard.tsx (150 lines)
├── PublishDialog.tsx (180 lines)
├── EmergencyServices.tsx (160 lines)
├── NearbyRecommend.tsx (180 lines)
├── StationProgress.tsx (180 lines)
└── ... 20 more components

8 Custom Hooks (each ~90-150 lines):
├── useUser.ts (120 lines)
├── usePosts.ts (150 lines)
├── useAIChat.ts (130 lines)
└── ... 5 more hooks

5 API Modules (each ~100-150 lines):
├── client.ts (80 lines)
├── posts.ts (140 lines)
├── images.ts (100 lines)
├── ai.ts (90 lines)
└── users.ts (110 lines)
```

**Result**: 3787 lines → 40+ files, no file > 200 lines ✅

## Internationalization (i18n) Strategy

### Translation Key Naming Convention

```
{namespace}.{screen/feature}.{element}_{description}
```

### Complete Translation Coverage

**zh.json (Chinese - 900+ keys)**
```json
{
  "common": {
    "button": {
      "cancel": "取消",
      "confirm": "确认",
      "save": "保存",
      "delete": "删除",
      "edit": "编辑",
      "back": "返回",
      "next": "下一步",
      "done": "完成",
      "retry": "重试",
      "refresh": "刷新"
    },
    "time": {
      "just_now": "刚刚",
      "minutes_ago": "{{count}}分钟前",
      "hours_ago": "{{count}}小时前",
      "days_ago": "{{count}}天前",
      "long_ago": "很久以前"
    },
    "validation": {
      "required": "此项必填",
      "invalid_format": "格式不正确",
      "too_long": "输入过长",
      "too_short": "输入过短"
    }
  },
  "nav": {
    "home": "首页",
    "discover": "发现",
    "wifi": "WiFi",
    "favorite": "优惠",
    "profile": "我的"
  },
  "home": {
    "title": "首页",
    "wifi": {
      "connect_button": "连接WiFi",
      "connected": "已连接",
      "connecting": "连接中...",
      "disconnect": "断开连接",
      "connect_success": "WiFi连接成功",
      "connect_failed": "WiFi连接失败"
    },
    "bus": {
      "current_station": "当前站",
      "next_station": "下一站",
      "stations_left": "还有{{count}}站"
    },
    "emergency": {
      "title": "应急服务",
      "toilet": "厕所",
      "store": "便利店",
      "pharmacy": "药店",
      "bank": "银行",
      "view_more": "查看更多服务"
    },
    "nearby": {
      "title": "附近推荐",
      "recommend": "推荐",
      "food": "美食",
      "fun": "玩乐",
      "scenic": "景点"
    },
    "ai_chat": {
      "title": "金陵喵",
      "placeholder": "有什么想问的吗？",
      "send": "发送"
    }
  },
  "discover": {
    "title": "发现",
    "tabs": {
      "look_around": "逛逛",
      "nearby_people": "附近的人"
    },
    "post": {
      "publish": "发布",
      "title_placeholder": "标题",
      "content_placeholder": "分享你的乘车故事...",
      "add_image": "添加图片",
      "select_bus": "选择车次",
      "max_images": "最多上传3张图片",
      "publishing": "发布中...",
      "publish_success": "发布成功",
      "publish_failed": "发布失败",
      "like": "赞",
      "liked": "已赞",
      "comment": "评论",
      "view_detail": "查看详情"
    },
    "validation": {
      "title_empty": "标题不能为空",
      "content_empty": "内容不能为空",
      "image_upload_failed": "图片上传失败"
    },
    "nearby_people": {
      "same_bus": "同车",
      "distance": "{{meters}}米",
      "start_chat": "开始聊天",
      "view_profile": "查看资料"
    }
  },
  "wifi": {
    "title": "WiFi",
    "available_networks": "可用网络",
    "merchant_info": "商家信息",
    "connect": "连接",
    "connected": "已连接",
    "signal_strong": "信号强",
    "signal_weak": "信号弱"
  },
  "favorite": {
    "title": "优惠",
    "no_offers": "暂无优惠信息",
    "view_detail": "查看详情"
  },
  "profile": {
    "title": "我的",
    "edit_profile": "编辑资料",
    "my_posts": "我的发布",
    "my_collects": "我的收藏",
    "settings": "设置",
    "language": "语言设置",
    "logout": "退出登录",
    "nickname": "昵称",
    "avatar": "头像",
    "user_id": "用户ID",
    "posts": "发布",
    "likes": "获赞",
    "collects": "收藏",
    "edit": {
      "title": "编辑资料",
      "nickname_placeholder": "请输入昵称",
      "save_success": "保存成功",
      "save_failed": "保存失败",
      "nickname_empty": "昵称不能为空"
    },
    "welcome": {
      "title": "欢迎使用小路游",
      "description": "为你生成了随机昵称和头像",
      "change_another": "换一个",
      "confirm": "确认使用"
    }
  },
  "ai_chat": {
    "title": "AI助手",
    "welcome_message": "你好！我是金陵喵，有什么可以帮你的吗？",
    "placeholder": "输入消息...",
    "send": "发送",
    "thinking": "思考中...",
    "error": "抱歉，出现了一些问题",
    "network_error": "网络连接失败，请稍后重试"
  }
}
```

**en.json (English - 900+ keys)**
```json
{
  "common": {
    "button": {
      "cancel": "Cancel",
      "confirm": "Confirm",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "back": "Back",
      "next": "Next",
      "done": "Done",
      "retry": "Retry",
      "refresh": "Refresh"
    },
    "time": {
      "just_now": "Just now",
      "minutes_ago": "{{count}} minutes ago",
      "hours_ago": "{{count}} hours ago",
      "days_ago": "{{count}} days ago",
      "long_ago": "Long ago"
    },
    "validation": {
      "required": "This field is required",
      "invalid_format": "Invalid format",
      "too_long": "Input too long",
      "too_short": "Input too short"
    }
  },
  "nav": {
    "home": "Home",
    "discover": "Discover",
    "wifi": "WiFi",
    "favorite": "Offers",
    "profile": "Profile"
  },
  "home": {
    "title": "Home",
    "wifi": {
      "connect_button": "Connect to WiFi",
      "connected": "Connected",
      "connecting": "Connecting...",
      "disconnect": "Disconnect",
      "connect_success": "WiFi connected successfully",
      "connect_failed": "WiFi connection failed"
    },
    "bus": {
      "current_station": "Current",
      "next_station": "Next",
      "stations_left": "{{count}} stops left"
    },
    "emergency": {
      "title": "Emergency Services",
      "toilet": "Toilet",
      "store": "Store",
      "pharmacy": "Pharmacy",
      "bank": "Bank",
      "view_more": "View more services"
    },
    "nearby": {
      "title": "Nearby",
      "recommend": "Recommended",
      "food": "Food",
      "fun": "Fun",
      "scenic": "Scenic"
    },
    "ai_chat": {
      "title": "JinLing Miao",
      "placeholder": "Ask me anything",
      "send": "Send"
    }
  },
  "discover": {
    "title": "Discover",
    "tabs": {
      "look_around": "Look Around",
      "nearby_people": "Nearby People"
    },
    "post": {
      "publish": "Publish",
      "title_placeholder": "Title",
      "content_placeholder": "Share your bus story...",
      "add_image": "Add Image",
      "select_bus": "Select Bus",
      "max_images": "Max 3 images",
      "publishing": "Publishing...",
      "publish_success": "Published successfully",
      "publish_failed": "Publish failed",
      "like": "Like",
      "liked": "Liked",
      "comment": "Comment",
      "view_detail": "View Details"
    },
    "validation": {
      "title_empty": "Title cannot be empty",
      "content_empty": "Content cannot be empty",
      "image_upload_failed": "Image upload failed"
    },
    "nearby_people": {
      "same_bus": "Same Bus",
      "distance": "{{meters}}m",
      "start_chat": "Start Chat",
      "view_profile": "View Profile"
    }
  },
  "wifi": {
    "title": "WiFi",
    "available_networks": "Available Networks",
    "merchant_info": "Merchant Info",
    "connect": "Connect",
    "connected": "Connected",
    "signal_strong": "Strong Signal",
    "signal_weak": "Weak Signal"
  },
  "favorite": {
    "title": "Offers",
    "no_offers": "No offers available",
    "view_detail": "View Details"
  },
  "profile": {
    "title": "Profile",
    "edit_profile": "Edit Profile",
    "my_posts": "My Posts",
    "my_collects": "My Collections",
    "settings": "Settings",
    "language": "Language",
    "logout": "Logout",
    "nickname": "Nickname",
    "avatar": "Avatar",
    "user_id": "User ID",
    "posts": "Posts",
    "likes": "Likes",
    "collects": "Collections",
    "edit": {
      "title": "Edit Profile",
      "nickname_placeholder": "Enter nickname",
      "save_success": "Saved successfully",
      "save_failed": "Save failed",
      "nickname_empty": "Nickname cannot be empty"
    },
    "welcome": {
      "title": "Welcome to XiaoLuYou",
      "description": "We've generated a random nickname and avatar for you",
      "change_another": "Try Another",
      "confirm": "Confirm"
    }
  },
  "ai_chat": {
    "title": "AI Assistant",
    "welcome_message": "Hi! I'm JinLing Miao, how can I help you?",
    "placeholder": "Type a message...",
    "send": "Send",
    "thinking": "Thinking...",
    "error": "Sorry, something went wrong",
    "network_error": "Network error, please try again later"
  }
}
```

**id.json (Indonesian - 900+ keys)**
```json
{
  "common": {
    "button": {
      "cancel": "Batal",
      "confirm": "Konfirmasi",
      "save": "Simpan",
      "delete": "Hapus",
      "edit": "Edit",
      "back": "Kembali",
      "next": "Selanjutnya",
      "done": "Selesai",
      "retry": "Coba Lagi",
      "refresh": "Segarkan"
    },
    "time": {
      "just_now": "Baru saja",
      "minutes_ago": "{{count}} menit yang lalu",
      "hours_ago": "{{count}} jam yang lalu",
      "days_ago": "{{count}} hari yang lalu",
      "long_ago": "Lama sekali"
    },
    "validation": {
      "required": "Bidang ini wajib diisi",
      "invalid_format": "Format tidak valid",
      "too_long": "Input terlalu panjang",
      "too_short": "Input terlalu pendek"
    }
  },
  "nav": {
    "home": "Beranda",
    "discover": "Jelajahi",
    "wifi": "WiFi",
    "favorite": "Penawaran",
    "profile": "Profil"
  },
  "home": {
    "title": "Beranda",
    "wifi": {
      "connect_button": "Hubungkan ke WiFi",
      "connected": "Terhubung",
      "connecting": "Menghubungkan...",
      "disconnect": "Putuskan",
      "connect_success": "WiFi berhasil terhubung",
      "connect_failed": "Koneksi WiFi gagal"
    },
    "bus": {
      "current_station": "Stasiun Saat Ini",
      "next_station": "Stasiun Berikutnya",
      "stations_left": "{{count}} stasiun tersisa"
    },
    "emergency": {
      "title": "Layanan Darurat",
      "toilet": "Toilet",
      "store": "Toko",
      "pharmacy": "Apotek",
      "bank": "Bank",
      "view_more": "Lihat layanan lainnya"
    },
    "nearby": {
      "title": "Terdekat",
      "recommend": "Rekomendasi",
      "food": "Makanan",
      "fun": "Hiburan",
      "scenic": "Wisata"
    },
    "ai_chat": {
      "title": "JinLing Miao",
      "placeholder": "Tanya apa saja",
      "send": "Kirim"
    }
  },
  "discover": {
    "title": "Jelajahi",
    "tabs": {
      "look_around": "Lihat Sekitar",
      "nearby_people": "Orang Terdekat"
    },
    "post": {
      "publish": "Terbitkan",
      "title_placeholder": "Judul",
      "content_placeholder": "Bagikan cerita perjalanan Anda...",
      "add_image": "Tambah Gambar",
      "select_bus": "Pilih Bus",
      "max_images": "Maks 3 gambar",
      "publishing": "Menerbitkan...",
      "publish_success": "Berhasil diterbitkan",
      "publish_failed": "Gagal menerbitkan",
      "like": "Suka",
      "liked": "Disukai",
      "comment": "Komentar",
      "view_detail": "Lihat Detail"
    },
    "validation": {
      "title_empty": "Judul tidak boleh kosong",
      "content_empty": "Konten tidak boleh kosong",
      "image_upload_failed": "Unggah gambar gagal"
    },
    "nearby_people": {
      "same_bus": "Bus Sama",
      "distance": "{{meters}}m",
      "start_chat": "Mulai Obrolan",
      "view_profile": "Lihat Profil"
    }
  },
  "wifi": {
    "title": "WiFi",
    "available_networks": "Jaringan Tersedia",
    "merchant_info": "Info Merchant",
    "connect": "Hubungkan",
    "connected": "Terhubung",
    "signal_strong": "Sinyal Kuat",
    "signal_weak": "Sinyal Lemah"
  },
  "favorite": {
    "title": "Penawaran",
    "no_offers": "Tidak ada penawaran",
    "view_detail": "Lihat Detail"
  },
  "profile": {
    "title": "Profil",
    "edit_profile": "Edit Profil",
    "my_posts": "Postingan Saya",
    "my_collects": "Koleksi Saya",
    "settings": "Pengaturan",
    "language": "Bahasa",
    "logout": "Keluar",
    "nickname": "Nama Panggilan",
    "avatar": "Avatar",
    "user_id": "ID Pengguna",
    "posts": "Postingan",
    "likes": "Suka",
    "collects": "Koleksi",
    "edit": {
      "title": "Edit Profil",
      "nickname_placeholder": "Masukkan nama panggilan",
      "save_success": "Berhasil disimpan",
      "save_failed": "Gagal menyimpan",
      "nickname_empty": "Nama panggilan tidak boleh kosong"
    },
    "welcome": {
      "title": "Selamat Datang di XiaoLuYou",
      "description": "Kami telah membuat nama panggilan dan avatar acak untuk Anda",
      "change_another": "Coba Lain",
      "confirm": "Konfirmasi"
    }
  },
  "ai_chat": {
    "title": "Asisten AI",
    "welcome_message": "Hai! Saya JinLing Miao, ada yang bisa saya bantu?",
    "placeholder": "Ketik pesan...",
    "send": "Kirim",
    "thinking": "Berpikir...",
    "error": "Maaf, terjadi kesalahan",
    "network_error": "Kesalahan jaringan, silakan coba lagi nanti"
  }
}
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function PublishDialog() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('discover.post.publish')}</Text>
      <TextInput placeholder={t('discover.post.title_placeholder')} />
      <TextInput placeholder={t('discover.post.content_placeholder')} />
      <Button title={t('common.button.confirm')} />
      <Button title={t('common.button.cancel')} />
    </View>
  );
}
```

### Dynamic Interpolation

```typescript
// Time formatting with interpolation
const timeText = t('common.time.minutes_ago', { count: 5 });
// Result: "5分钟前" (zh) / "5 minutes ago" (en) / "5 menit yang lalu" (id)

// Distance display
const distance = t('discover.nearby_people.distance', { meters: 120 });
// Result: "120米" (zh) / "120m" (en) / "120m" (id)
```

## State Management Architecture

### Global State (React Context)

**UserContext.tsx** - User authentication and profile
```typescript
interface UserContextType {
  userId: string;
  nickname: string;
  avatar: string;
  isFirstLaunch: boolean;
  postCount: number;
  likeCount: number;
  collectCount: number;
  updateProfile: (nickname: string, avatar: string) => Promise<void>;
  generateRandomAvatar: () => string;
  syncToServer: () => Promise<void>;
  logout: () => Promise<void>;
}
```

**ThemeContext.tsx** - App theme configuration
```typescript
interface ThemeContextType {
  colors: ColorPalette;
  spacing: Spacing;
  fontSize: FontSizes;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
```

### Local State (Component State)

Use `useState` for:
- Form inputs (title, content)
- Modal/dialog visibility
- Tab selection
- Loading states
- Image selection

### Complex State (useReducer)

Use for:
- Post list with filters and sorting
- Chat message history with pagination
- Multi-step form wizards

## API Integration Layer

### API Client Configuration

```typescript
// src/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - add auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Can add JWT token here if implementing auth
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    } else if (error.response?.status >= 500) {
      // Handle server errors
    }
    return Promise.reject(error);
  }
);
```

### API Module Example: posts.ts

```typescript
// src/api/posts.ts
import { apiClient } from './client';
import { Post, CreatePostRequest, CreatePostResponse } from '../types/api';

export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await apiClient.post('/posts', data);
  return response.data;
}

export async function getPosts(userId?: string): Promise<Post[]> {
  const params = userId ? { userId } : {};
  const response = await apiClient.get('/posts', { params });
  return response.data.posts;
}

export async function likePost(postId: string, userId: string): Promise<{ likes: number }> {
  const response = await apiClient.post('/posts/like', { postId, userId });
  return response.data;
}

export async function unlikePost(postId: string, userId: string): Promise<{ likes: number }> {
  const response = await apiClient.post('/posts/unlike', { postId, userId });
  return response.data;
}
```

## TypeScript Type Definitions

### Complete Type System

```typescript
// src/types/api.ts
export interface CreatePostRequest {
  title: string;
  content: string;
  busTag: string;
  imageUrls?: string[];
  userId: string;
  username: string;
  avatar: string;
}

export interface CreatePostResponse {
  postId: string;
}

export interface Post {
  post_id: string;
  title: string;
  content: string;
  username: string;
  avatar: string;
  timestamp: number;
  bus_tag: string;
  likes: number;
  comments: number;
  image_urls: string;
  is_liked: boolean;
  user_id: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface WiFiNetwork {
  ssid: string;
  signal: 'strong' | 'medium' | 'weak';
  isConnected: boolean;
}

export interface MerchantInfo {
  name: string;
  category: string;
  distance: number;
  offer?: string;
}

export interface NearbyPerson {
  userId: string;
  nickname: string;
  avatar: string;
  location: string;
  distance: number;
  signature: string;
  isSameBus: boolean;
}
```

## Performance Optimization Strategy

### 1. List Rendering with FlatList

```typescript
<FlatList
  data={posts}
  renderItem={({ item }) => <PostCard post={item} />}
  keyExtractor={(item) => item.post_id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  onEndReached={loadMorePosts}
  onEndReachedThreshold={0.5}
/>
```

### 2. Component Memoization

```typescript
const PostCard = React.memo(
  ({ post, onLike }: PostCardProps) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    return (
      prevProps.post.post_id === nextProps.post.post_id &&
      prevProps.post.likes === nextProps.post.likes &&
      prevProps.post.is_liked === nextProps.post.is_liked
    );
  }
);
```

### 3. Image Optimization

```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  style={styles.image}
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable
  }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 4. Callback Memoization

```typescript
const handleLike = useCallback((postId: string) => {
  // Like logic
}, []);

const handlePress = useCallback(() => {
  navigation.navigate('PostDetail', { postId: post.post_id });
}, [post.post_id]);
```

## Migration Phases & Timeline

### Phase 1: Project Setup (Week 1)
- [ ] Initialize React Native project with TypeScript
- [ ] Setup folder structure
- [ ] Configure navigation (React Navigation)
- [ ] Setup i18n with translation files
- [ ] Configure ESLint, Prettier
- [ ] Setup API client (Axios)
- [ ] Create theme constants

### Phase 2: Common Components (Week 2)
- [ ] Avatar component
- [ ] Button component
- [ ] Card component
- [ ] Input component
- [ ] Tag component
- [ ] Loading indicator
- [ ] Empty state component

### Phase 3: User Management (Week 2-3)
- [ ] UserContext implementation
- [ ] AsyncStorage wrapper
- [ ] User registration flow
- [ ] Welcome dialog
- [ ] Profile management
- [ ] Avatar generation logic

### Phase 4: Home Screen (Week 3-4)
- [ ] HomeScreen layout
- [ ] BusInfo component
- [ ] StationProgress component
- [ ] WiFiButton component
- [ ] EmergencyServices component
- [ ] NearbyRecommend component
- [ ] AI chat integration

### Phase 5: Discover Screen (Week 4-5)
- [ ] DiscoverScreen layout
- [ ] PostCard component
- [ ] PostList component
- [ ] PublishDialog component
- [ ] ImagePicker integration
- [ ] BusSelector component
- [ ] Like/unlike functionality
- [ ] NearbyPeopleCard component

### Phase 6: WiFi Screen (Week 5)
- [ ] WiFiScreen layout
- [ ] WiFiListItem component
- [ ] MerchantCard component
- [ ] Connection logic

### Phase 7: Favorite & Profile Screens (Week 6)
- [ ] FavoriteScreen layout
- [ ] ProfileScreen layout
- [ ] ProfileHeader component
- [ ] StatsCard component
- [ ] MyPostsScreen
- [ ] Settings dialog
- [ ] Language selection

### Phase 8: AI Chat Screen (Week 6)
- [ ] AIChatScreen layout
- [ ] ChatBubble component
- [ ] ChatInput component
- [ ] ChatHistory component
- [ ] AI API integration

### Phase 9: Testing & Bug Fixes (Week 7)
- [ ] Unit tests for utils
- [ ] Component tests
- [ ] Integration tests
- [ ] Bug fixing
- [ ] Performance optimization

### Phase 10: Platform-Specific Polish (Week 7-8)
- [ ] iOS safe area handling
- [ ] iOS shadows and blur effects
- [ ] Android back button handling
- [ ] Android elevation
- [ ] Platform-specific styling

### Phase 11: Build & Deployment (Week 8)
- [ ] Android APK build
- [ ] iOS IPA build
- [ ] App icons and splash screens
- [ ] Release notes
- [ ] Distribution setup

**Total Estimated Time: 8 weeks** with 2-3 developers

## Success Criteria

### Functional Requirements ✅
- All features from original app ported
- iOS and Android both functional
- Three languages (zh, en, id) fully translated
- No file exceeds 200 lines
- Zero hardcoded Chinese strings
- Backend API integration working
- Image upload functional
- AI chat functional

### Non-Functional Requirements
- App launch time < 3 seconds
- Image upload completes in < 10 seconds
- List scrolling at 60 FPS
- App size < 50MB (APK/IPA)
- Memory usage < 200MB
- Zero crashes in production
- Test coverage > 60%

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| React Native learning curve | Medium | Medium | Provide training, documentation |
| iOS development requires macOS | High | High | Ensure team has macOS access |
| Third-party library incompatibility | Low | Medium | Thoroughly vet libraries |
| Performance on old devices | Medium | Medium | Test on Android 8.0, iOS 12 |
| Backend API breaking changes | Low | High | Version API, maintain compatibility |
| Translation quality | Medium | Low | Native speaker review |

## Conclusion

This refactoring plan transforms a 3787-line monolithic Android app into a modern, maintainable, cross-platform React Native application with:

1. **40+ modular files** (all < 200 lines)
2. **Full internationalization** (zh/en/id)
3. **Type-safe codebase** (TypeScript)
4. **Cross-platform support** (iOS + Android)
5. **Better testability** (modular architecture)
6. **Improved maintainability** (clean code structure)

The migration will take approximately **8 weeks** with 2-3 developers working full-time.
