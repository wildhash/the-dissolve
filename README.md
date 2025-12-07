# The Dissolve

Quest 3 MR psychedelic experience using AI+passthrough+hand tracking

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

### Prerequisites

- Meta Quest 3 with latest firmware
- Developer mode enabled
- USB-C cable for development

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then connect your Quest 3 via USB and enable USB debugging. Navigate to your computer's IP address on port 3000 using the Quest browser.

**Note**: HTTPS is required for WebXR. The dev server runs with self-signed certificates.

### Build

```bash
npm run build
```

### Deployment

The built files in `dist/` can be hosted on any HTTPS server. For Quest 3 deployment, upload to a web server accessible from the headset.

## Technical Details

- Built with Three.js for 3D rendering
- WebXR API for VR/MR support
- Hand Tracking API for gesture recognition
- Web Audio API for binaural beats and Shepard tones
- Custom GLSL shaders for visual effects

## Controls

- **Pinch gesture**: Increase effect intensity
- **Open palm**: Spread kaleidoscope effect
- **Point gesture**: Direct visual flow
- **Both hands together**: Pause/resume
- **Emergency Stop button**: Immediate safe exit

## Built For

Meta Hackathon - Exploring the intersection of XR, AI, and altered states of consciousness

## License

MIT

## Disclaimer

This is an artistic and entertainment experience. It is not intended for therapeutic use. Use responsibly and at your own risk.
