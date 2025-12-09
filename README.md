# The Dissolve

Quest 3 MR psychedelic experience using WebXR + passthrough + hand tracking

> **Important**: This is a WebXR-based web application, not a Unity project. See [BUILD.md](BUILD.md) for complete build instructions.

## ⚠️ PHOTOSENSITIVITY WARNING ⚠️

**DO NOT USE if you have a history of epilepsy or photosensitive seizures.**

This experience contains:
- Flashing lights and strobing effects (max 2Hz)
- Rapid color changes and visual distortions
- Binaural audio frequencies (4-40Hz)
- Intense visual effects that may cause discomfort

If you experience dizziness, nausea, disorientation, or discomfort, **STOP IMMEDIATELY** and press the emergency stop button.

## Features

- **MR Passthrough Mode**: Transforms your real environment into a psychedelic dreamscape
- **Hand Tracking**: Gesture-controlled visual distortion
  - 🖐️ Pinch: Intensity control
  - ✋ Open palm: Spread distortion
  - 👉 Point: Direction control
  - ⏸️ Both hands together: Pause
- **Energy Hand Trails**: Colorful trails follow your hand movements
- **Melting Reality Shader**: Dynamic visual distortions with chromatic aberration
- **Fractal Geometry**: Animated Sierpinski tetrahedrons, Menger sponges, Julia sets, and sacred geometry
- **Binaural Entrainment**: Audio frequencies synchronized with brain waves (4-40Hz)
- **Shepard Tones**: Infinite ascending audio illusion
- **4-Phase Trip Progression**:
  1. **Onset** (3 min): Reality begins to shift - Theta waves (4-8Hz)
  2. **Peak** (5 min): Full immersion - Alpha to Beta waves (8-30Hz)
  3. **Plateau** (4 min): Sustained altered state - Beta waves (30-40Hz)
  4. **Comedown** (3 min): Gradual return to baseline - Back to Theta

## Safety Features

- Emergency stop button (visible at all times)
- Maximum 2Hz strobe rate (well below seizure threshold)
- Gradual intensity transitions
- Pause functionality
- Clear warning screens

## Setup

For complete build and deployment instructions, see **[BUILD.md](BUILD.md)**.

### Quick Start

### Prerequisites

- Meta Quest 3 with latest firmware
- Developer mode enabled (for local development)
- Modern web browser with WebXR support
- Node.js 22+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then connect your Quest 3 to the same WiFi network and navigate to your computer's IP address on port 3000 using the Quest browser.

**Note**: HTTPS is required for WebXR. The dev server runs with self-signed certificates.

### Build

```bash
npm run build
```

### Deployment

See **[BUILD.md](BUILD.md)** and **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions.

Quick options:
- **GitHub Pages**: Automated deployment via GitHub Actions (configured)
- **Netlify**: One-click deployment with `netlify.toml` configuration included
- **Vercel**: Deploy with `vercel --prod`
- **Local**: Serve `dist/` folder over HTTPS

## Documentation

- **[BUILD.md](BUILD.md)** - Complete build instructions and troubleshooting
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment options and hosting setup
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and changes

## Technical Details

- **Framework**: Three.js v0.160.0 for 3D rendering
- **Build Tool**: Vite v7.2.7 (latest, secure)
- **APIs**: WebXR Device API, WebXR Hand Input, Web Audio API
- **Rendering**: WebGL with custom GLSL shaders
- **Target Platform**: Meta Quest 3 (WebXR-enabled browsers)
- **Security**: Zero known vulnerabilities, modern security headers configured

## Controls

- **Pinch gesture**: Increase effect intensity
- **Open palm**: Spread kaleidoscope effect
- **Point gesture**: Direct visual flow
- **Both hands together**: Pause/resume
- **Emergency Stop button**: Immediate safe exit

## Built For

Meta Horizon Creator Competition - Exploring the intersection of XR, AI, and altered states of consciousness.

This is a **WebXR-based** experience accessible through any WebXR-compatible browser on Quest 3.

## License

MIT

## Disclaimer

This is an artistic and entertainment experience. It is not intended for therapeutic use. Use responsibly and at your own risk.
