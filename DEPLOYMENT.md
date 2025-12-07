# Deployment Guide - The Dissolve

## Quest 3 Deployment

### Prerequisites
- Meta Quest 3 with latest firmware
- Developer mode enabled on Quest 3
- Meta Quest Developer account

### Option 1: Local Development Server

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start development server** (requires HTTPS for WebXR):
   ```bash
   npm run dev
   ```

3. **Connect Quest 3**:
   - Connect your computer and Quest 3 to the same WiFi network
   - Find your computer's local IP address (e.g., 192.168.1.100)
   - Open Quest Browser on Quest 3
   - Navigate to `https://[YOUR_IP]:3000`
   - Accept the self-signed certificate warning

### Option 2: Deploy to Hosting Service

#### Using Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Access from Quest 3**:
   - Open Quest Browser
   - Navigate to your Netlify URL
   - Bookmark for easy access

#### Using Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Access from Quest 3**:
   - Open Quest Browser
   - Navigate to your Vercel URL

#### Using GitHub Pages

1. **Update vite.config.js** with your base path:
   ```javascript
   export default defineConfig({
     base: '/the-dissolve/',
     // ... rest of config
   });
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   cd dist
   git init
   git add -A
   git commit -m 'deploy'
   git push -f git@github.com:username/the-dissolve.git main:gh-pages
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select `gh-pages` branch
   - Save

### Option 3: SideQuest / App Lab

For a native-like experience, you can package this as a WebXR app:

1. **Create a WebXR wrapper** using tools like:
   - [Wolvic Browser](https://wolvic.com/)
   - Custom WebView wrapper

2. **Submit to App Lab**:
   - Follow Meta's App Lab submission guidelines
   - Include all safety warnings
   - Provide clear instructions

## Testing

### Desktop Browser Testing (Demo Mode)

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open in Chrome/Edge (best WebXR support)

3. Controls in demo mode:
   - Left click: Intensity boost (simulates pinch)
   - Right click: Spread effect (simulates open palm)
   - Mouse movement: Direction control

### Quest 3 Testing

1. Enable Developer Mode:
   - Install Meta Quest Developer Hub on PC
   - Enable Developer Mode in Quest settings

2. USB Debugging (optional):
   - Connect Quest via USB-C
   - Enable USB debugging when prompted
   - Use Chrome DevTools for debugging: `chrome://inspect`

3. Test Features:
   - Hand tracking gestures
   - Passthrough mode
   - Audio (ensure volume is comfortable)
   - Emergency stop button
   - All 4 trip phases

## Performance Optimization

### For Quest 3

- The experience is optimized for Quest 3's hardware
- Target: 72Hz minimum, 90Hz preferred
- Particle count is limited for performance
- Shader complexity balanced for mobile GPU

### Monitoring Performance

Use Quest 3's built-in performance overlay:
1. Enable Developer Mode
2. Open Settings > System > Developer
3. Enable "Performance Overlay"

## Safety Checklist

Before deployment, verify:

- [ ] Warning screen appears first
- [ ] Emergency stop button is always visible
- [ ] No strobing faster than 2Hz
- [ ] Audio volume is comfortable (not too loud)
- [ ] All safety warnings are displayed
- [ ] Controls are clearly explained
- [ ] Experience can be paused/stopped at any time

## Troubleshooting

### "WebXR not supported"
- Ensure you're using Quest Browser or Chrome
- Check that the site is served over HTTPS
- Verify Quest firmware is up to date

### Hand tracking not working
- Enable hand tracking in Quest settings
- Ensure good lighting conditions
- Try removing and reinserting controllers

### Performance issues
- Reduce fractal complexity in FractalGeometry.js
- Lower particle counts
- Disable some shader effects

### Audio not playing
- Check browser audio permissions
- Ensure volume is up on Quest 3
- Some browsers require user interaction before playing audio

## Additional Resources

- [WebXR Device API](https://www.w3.org/TR/webxr/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Meta Quest Developer Docs](https://developer.oculus.com/)
- [WebXR Hand Input](https://github.com/immersive-web/webxr-hand-input)

## Support

For issues or questions:
1. Check the GitHub Issues page
2. Review the troubleshooting section
3. Check browser console for errors

Remember: This is an experimental art project. Use responsibly!
