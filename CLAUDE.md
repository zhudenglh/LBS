# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a multi-project repository containing three main applications related to public transit and video processing:

1. **ChuxingbaoBackend** - Node.js backend API for a public transit social platform
2. **NanjingBusService** - React-based web app for Nanjing bus WiFi and transit services
3. **HelloWorldApp** - Android app (Java) for displaying bus posts with images
4. **Video Subtitle Tool** - Python script for extracting subtitles from videos

## Project Structure

```
LBS/
├── ChuxingbaoBackend/     # Backend API (Node.js + Express)
├── NanjingBusService/     # Frontend web app (React)
├── HelloWorldApp/         # Android app (Java)
├── video_subtitle_agent.py # Standalone video subtitle tool
└── *.md files             # Documentation and PRD
```

## Common Commands

### ChuxingbaoBackend (Node.js Backend)

```bash
# Install dependencies
cd ChuxingbaoBackend
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Check server health
curl http://localhost:3000/health
```

**Key endpoints:**
- `POST /api/upload-image` - Upload images to Alibaba Cloud OSS
- `POST /api/posts` - Create new posts
- `GET /api/posts` - Retrieve all posts
- `GET /health` - Health check

**Configuration:** Requires `config.js` with Alibaba Cloud credentials (OSS and Tablestore). This file is gitignored for security.

### NanjingBusService (React Frontend)

```bash
# Install dependencies
cd NanjingBusService
npm install

# Start development server (opens browser at http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

**Note:** Currently uses mock data in `src/data/mockData.js`. Production deployment requires real API integration.

### HelloWorldApp (Android)

```bash
# Build debug APK
cd HelloWorldApp
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install to connected device
./gradlew installDebug

# Run all tests
./gradlew test
```

**Output APK location:** `app/build/outputs/apk/debug/app-debug.apk`

**Important:** Update `ApiClient.java` BASE_URL to match your backend server before building.

### Video Subtitle Tool (Python)

```bash
# Install dependencies
./install.sh

# Extract subtitles from video
./run.sh "https://www.youtube.com/watch?v=xxxxx"

# With custom filename
./run.sh "https://www.youtube.com/watch?v=xxxxx" "my_notes"
```

**Requirements:** Python 3.12, yt-dlp, FFmpeg, OpenAI Whisper, OpenCC

## Architecture Notes

### ChuxingbaoBackend Architecture

**Technology Stack:**
- Express.js server with CORS enabled
- Alibaba Cloud OSS for image storage
- Alibaba Cloud Tablestore (NoSQL) for post data
- Multer for multipart/form-data handling

**Data Flow:**
1. Android app uploads images via `/api/upload-image`
2. Images stored in OSS with generated URLs
3. Posts created with image URLs in Tablestore
4. Posts retrieved and sorted by timestamp

**Database Schema (Tablestore):**
- Primary Key: `post_id` (string)
- Attributes: `title`, `content`, `username`, `avatar`, `timestamp`, `bus_tag`, `likes`, `comments`, `image_urls` (comma-separated)

### NanjingBusService Architecture

**Component Structure:**
- `BusHeader.jsx` - WiFi connection and route info
- `StationProgress.jsx` - Visual station timeline with arrival alerts
- `EmergencyServices.jsx` - Quick access to toilets/convenience stores/pharmacies
- `TransferInfo.jsx` - Metro/bus/bike sharing transfer options
- `OfferCards.jsx` - Nearby merchant promotions

**Design Principles:**
- iOS-style UI with blue/white color scheme
- 3-second rule: any info accessible within 3 seconds
- Emergency services prioritized at top
- All styles modular (separate CSS files per component)

**Current Limitations:**
- Uses mock data (`src/data/mockData.js`)
- Needs integration with: Nanjing Bus API, Amap POI API, Metro real-time API, merchant systems

### HelloWorldApp Architecture

**Key Classes:**
- `MainActivity.java` - Main activity showing post feed
- `ApiClient.java` - HTTP client for backend communication (hardcoded BASE_URL)
- `DataAdapter.java` - RecyclerView adapter for posts
- `DataItem.java` - Post data model
- `ServiceDetailActivity.java` - Detail view for posts

**API Integration:**
- Fetches posts from ChuxingbaoBackend
- Displays images loaded from OSS URLs
- **Critical:** Change `BASE_URL` in `ApiClient.java` before building for different environments

### Video Subtitle Agent

**Processing Pipeline:**
1. `get_video_title()` - Extract video title using yt-dlp
2. `download_video()` - Download video with yt-dlp
3. `video_to_audio()` - Extract audio using FFmpeg (16kHz mono WAV)
4. `audio_to_text()` - Transcribe with OpenAI Whisper (base model, Chinese)
5. `convert_to_simplified()` - Convert traditional to simplified Chinese with OpenCC
6. `save_to_markdown()` - Save formatted output

**Output:** Markdown files in `/Users/bytedance/Documents/lin_knowledge/`

**Model Selection:** Edit line 195 in `video_subtitle_agent.py` to change Whisper model (tiny/base/small/medium/large)

## Deployment

### Backend Deployment (Alibaba Cloud)

See `ChuxingbaoBackend/README_DEPLOY.md` for complete guide.

**Quick Start:**
```bash
cd ChuxingbaoBackend
chmod +x deploy.sh
./deploy.sh
```

**Requirements:**
- CentOS 7.9 or Ubuntu 20.04
- Security group: Allow port 3000 (TCP)
- PM2 for process management
- Valid Alibaba Cloud credentials in `config.js`

### Android APK Distribution

See `build_apk.md` for building and signing APKs.

**Debug Build:**
```bash
cd HelloWorldApp
./gradlew assembleDebug
```

APK location: `app/build/outputs/apk/debug/app-debug.apk`

## Important Files

- `南京公交小程序PRD.md` - Complete product requirements document with business model, user personas, monetization strategy
- `config.js` (ChuxingbaoBackend) - **SENSITIVE** - Contains Alibaba Cloud credentials, must be created manually
- `src/data/mockData.js` (NanjingBusService) - Mock data for development, replace with real API calls in production

## Development Notes

### Security Considerations

- **Never commit `config.js`** - Contains AccessKey credentials for Alibaba Cloud
- Backend uses public OSS URLs - ensure bucket permissions are properly configured
- No authentication currently implemented in backend API - add before production use

### Cross-Project Dependencies

- HelloWorldApp depends on ChuxingbaoBackend being deployed and accessible
- Update `ApiClient.java` BASE_URL when backend server address changes
- NanjingBusService is independent but follows same design language as HelloWorldApp

### Common Issues

**Backend Won't Start:**
- Check if `config.js` exists and has valid credentials
- Verify port 3000 is not in use: `netstat -an | grep 3000`
- Check PM2 logs: `pm2 logs chuxingbao-backend`

**Android Build Fails:**
- Ensure Android SDK is installed and ANDROID_HOME is set
- Sync Gradle files in Android Studio
- Check Java version (requires JDK 11+)

**Video Tool Errors:**
- Ensure yt-dlp is updated: `yt-dlp -U`
- Verify FFmpeg is installed: `ffmpeg -version`
- Check Whisper installation: `whisper --help`
- For region-restricted videos, may need VPN

### Testing

**Backend API Testing:**
```bash
# Health check
curl http://localhost:3000/health

# Get posts
curl http://localhost:3000/api/posts

# Upload image (requires multipart/form-data)
curl -X POST -F "image=@test.jpg" http://localhost:3000/api/upload-image
```

**React App Testing:**
```bash
cd NanjingBusService
npm test
```

## PRD Reference

The `南京公交小程序PRD.md` contains comprehensive product specifications including:
- Target user personas (commuters, students, elderly, tourists)
- 4-phase product roadmap (MVP → Feature Complete → Commercialization → Ecosystem)
- Monetization models (subscriptions, commissions, ads, B2B data services)
- Technical architecture and KPIs

Key design principles from PRD:
- **3-second access rule** - Any function reachable in ≤3 steps
- **High-frequency features first** - Emergency services and transfers prioritized
- **Elderly-friendly** - Large fonts, voice control, high contrast mode
- **WiFi as core differentiator** - One-tap bus WiFi connection
