# Build Instructions for The Dissolve

## Important Note

This project is a **WebXR-based** implementation, not a Unity project. If you were expecting a Unity project for Quest 3, please note that this is a web-based XR experience that runs in the Quest 3 browser.

## Prerequisites

### Required Software
- **Node.js 22+** (required for Vite 7)
- **npm** (comes with Node.js)
- **Git** (for version control)

### For Quest 3 Deployment
- Meta Quest 3 with latest firmware
- Quest Browser (built-in)
- HTTPS-capable web server or hosting service

### Installation

Check your Node.js version:
```bash
node --version  # Should be 22.x or higher
```

If you need to update Node.js:
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **macOS**: `brew install node@22`
- **Linux**: Use nvm or your package manager

## Building the Project

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Vite 7.2.7 (build tool)
- Three.js 0.160.0 (3D rendering)

**Security Note**: All dependencies are verified to have zero known vulnerabilities.

### 2. Development Build

For local testing:

```bash
npm run dev
```

This starts a development server at `https://localhost:3000` (HTTPS required for WebXR).

**Testing on Quest 3**:
1. Connect Quest 3 to the same WiFi network as your computer
2. Find your computer's local IP address
3. Open Quest Browser on Quest 3
4. Navigate to `https://[YOUR_IP]:3000`
5. Accept the self-signed certificate warning
6. Click "ENTER VR" to start the experience

### 3. Production Build

For deployment:

```bash
npm run build
```

This creates optimized files in the `dist/` directory:
- `dist/index.html` (~5 KB)
- `dist/assets/index-[hash].js` (~477 KB, gzips to ~122 KB)
- Source maps for debugging

**Build Verification**:
```bash
# Check build succeeded
ls -lh dist/

# Verify no vulnerabilities
npm audit

# Preview production build locally
npm run preview
```

## Deployment Options

### Option 1: GitHub Pages (Automated)

✅ **Already configured!**

1. Push to the `main` branch
2. GitHub Actions automatically builds and deploys
3. Access at: `https://[username].github.io/the-dissolve/`

**First-time setup**:
1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. The workflow runs automatically

### Option 2: Netlify (Recommended for Competition)

✅ **Already configured with `netlify.toml`!**

**Deploy from Git**:
1. Sign up at [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Connect your GitHub repository
4. Netlify auto-detects the configuration
5. Deploy!

**Deploy via CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Features**:
- Automatic HTTPS
- CDN distribution
- Security headers pre-configured
- Optimized for WebXR

### Option 3: Vercel

```bash
npm install -g vercel
vercel --prod
```

### Option 4: Custom Server

Requirements:
- HTTPS enabled (required for WebXR)
- Serve static files from `dist/` directory
- Recommended: Enable gzip compression

**Example with Python**:
```bash
cd dist
python3 -m http.server 8000 --bind 0.0.0.0
```
Note: This serves HTTP only. For HTTPS, use a reverse proxy like Nginx or Caddy.

## Troubleshooting

### Build Fails

**Error**: "The CJS build of Vite's Node API is deprecated"
- **Solution**: Update to Vite 7+ (already done in this repo)

**Error**: "ENOENT: no such file or directory"
- **Solution**: Run `npm install` first

**Error**: Node version mismatch
- **Solution**: Update to Node.js 22+

### Security Vulnerabilities

Run `npm audit` to check. This repo should show:
```
found 0 vulnerabilities
```

If vulnerabilities appear after adding new dependencies:
```bash
npm audit fix
# Or for breaking changes:
npm audit fix --force
```

### Quest 3 Not Working

**WebXR not supported**:
- Use Quest Browser (built-in, WebXR-enabled)
- Ensure site is served over HTTPS
- Check Quest firmware is up to date

**Hand tracking not detected**:
- Enable hand tracking in Quest settings
- Ensure good lighting
- Try removing controllers

**Performance issues**:
- Close other browser tabs
- Reduce particle/fractal complexity in source files
- Check Quest isn't overheating

## For Competition Judges

### Quick Start
1. Visit the deployed URL (provided in submission)
2. Read and accept the photosensitivity warning
3. Click "ENTER VR" on Quest 3
4. Use hand gestures to control the experience
5. Emergency stop button available at all times

### Demo Mode (Desktop)
The experience can be previewed on desktop browsers:
- **Left click**: Intensity control
- **Right click**: Spread effect
- **Mouse movement**: Direction control

Note: Full experience requires Quest 3 with hand tracking.

## Build Checklist

Before submission:

- [x] Dependencies installed (`npm install`)
- [x] No security vulnerabilities (`npm audit`)
- [x] Production build successful (`npm run build`)
- [x] Output files in `dist/` directory
- [x] Deployment method chosen and tested
- [x] Quest 3 testing completed (if available)
- [x] Emergency stop button functional
- [x] Warning screen displays correctly
- [x] Hand tracking gestures work
- [x] Audio plays correctly
- [x] All 4 phases progress smoothly

## Technical Specifications

**Built With**:
- Three.js 0.160.0 (3D rendering engine)
- Vite 7.2.7 (build tool)
- WebXR Device API (VR/MR support)
- WebXR Hand Input API (gesture recognition)
- Web Audio API (binaural beats)

**Target Platform**:
- Meta Quest 3 (primary)
- Any WebXR-enabled browser (secondary)

**Performance**:
- Target: 72-90 FPS on Quest 3
- Bundle size: 477 KB (122 KB gzipped)
- Load time: < 3 seconds on good connection

**Security**:
- Zero known vulnerabilities
- CSP headers configured
- HTTPS required
- No external API calls

## File Structure

```
the-dissolve/
├── src/                      # Source code
│   ├── main.js              # Application entry
│   ├── HandTracking.js      # Gesture recognition
│   ├── AudioEngine.js       # Binaural beats
│   ├── ShaderEffects.js     # Visual effects
│   ├── FractalGeometry.js   # Fractal rendering
│   ├── TripPhaseManager.js  # Phase progression
│   └── MouseControls.js     # Demo mode
├── dist/                     # Build output (generated)
├── .github/workflows/        # CI/CD automation
├── netlify.toml             # Netlify configuration
├── vite.config.js           # Build configuration
├── package.json             # Dependencies
└── README.md                # Project documentation
```

## Need Help?

1. Check `DEPLOYMENT.md` for deployment details
2. Review `ARCHITECTURE.md` for system design
3. See `CHANGELOG.md` for recent changes
4. Open an issue on GitHub

## Differences from Unity-Based Quest Development

If you were expecting a Unity project:

| Unity Approach | This Project (WebXR) |
|---------------|---------------------|
| Unity Editor 6000.3.0f1 | Vite + Three.js |
| Android SDK + JDK | Node.js only |
| Build APK file | Build web assets |
| ADB install | Web server deployment |
| Oculus Integration SDK | WebXR API |
| C# scripts | JavaScript/ES6 |
| OVRCameraRig | Three.js PerspectiveCamera |
| Meta XR packages | Web APIs |

**Advantages of WebXR**:
- ✅ No SDK installation needed
- ✅ Cross-platform (works on any WebXR device)
- ✅ Instant updates (no reinstall)
- ✅ Easier deployment (just upload files)
- ✅ Faster iteration (hot reload)
- ✅ Open web standards

**Considerations**:
- Requires HTTPS hosting
- Internet connection needed (unless cached)
- Browser-dependent performance
- Limited to WebXR API capabilities

Both approaches are valid for Quest 3 development. This project chose WebXR for rapid prototyping and web accessibility.
