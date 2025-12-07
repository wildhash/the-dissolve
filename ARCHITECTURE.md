# System Architecture - The Dissolve

```
┌─────────────────────────────────────────────────────────────────────┐
│                         THE DISSOLVE                                 │
│              Quest 3 MR Psychedelic Experience                       │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────┴────────────┐
                    │      index.html          │
                    │  (Warning Screen + UI)   │
                    └────────────┬────────────┘
                                 │
                                 │
                    ┌────────────▼────────────┐
                    │       main.js            │
                    │   (Core Application)     │
                    │   - Scene setup          │
                    │   - Animation loop       │
                    │   - Effect coordination  │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
     ┌───────────▼───────┐  ┌───▼────────┐  ┌──▼──────────┐
     │  HandTracking.js  │  │ AudioEngine│  │ShaderEffects│
     │  ┌─────────────┐  │  │            │  │             │
     │  │Gesture Rec. │  │  │  Binaural  │  │  Melting    │
     │  │- Pinch      │  │  │  Beats     │  │  Reality    │
     │  │- Open Palm  │  │  │  4-40Hz    │  │  Shader     │
     │  │- Pointing   │  │  │            │  │             │
     │  │- Pause      │  │  │  Shepard   │  │  Chroma     │
     │  └─────────────┘  │  │  Tones     │  │  Aberration │
     │                   │  │            │  │             │
     │  OR (Demo Mode)   │  │  Volume    │  │  Kaleidosc. │
     │                   │  │  Control   │  │  Effect     │
     │  MouseControls.js │  └────────────┘  └─────────────┘
     └───────────────────┘
                 │
                 │
     ┌───────────▼───────┐  ┌────────────┐  ┌─────────────┐
     │FractalGeometry.js │  │TripPhase   │  │Hand Trails  │
     │                   │  │Manager.js  │  │(Particles)  │
     │  - Sierpinski     │  │            │  │             │
     │  - Menger Sponge  │  │  4 Phases: │  │- Spawning   │
     │  - Julia Set      │  │  1. Onset  │  │- Fading     │
     │  - Sacred Geom.   │  │  2. Peak   │  │- Cleanup    │
     │                   │  │  3. Plateau│  │             │
     │  - Animation      │  │  4. Comedown│ │             │
     │  - Color Shift    │  │            │  │             │
     └───────────────────┘  └────────────┘  └─────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                        INPUT SOURCES                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Quest 3:                  │  Desktop Demo:                         │
│  • WebXR Hand Tracking     │  • Mouse Movement (direction)          │
│  • Hand Gestures           │  • Left Click (pinch/intensity)        │
│  • MR Passthrough          │  • Right Click (open palm/spread)      │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUT EFFECTS                                │
├─────────────────────────────────────────────────────────────────────┤
│  Visual:                   │  Audio:                                │
│  • Fractal geometry        │  • Binaural beats (4-40Hz)             │
│  • Melting shaders         │  • Shepard tones                       │
│  • Hand trails             │  • Phase-synchronized                  │
│  • Color cycling           │  • Safe volume levels                  │
│  • Distortion effects      │                                        │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      SAFETY SYSTEMS                                  │
├─────────────────────────────────────────────────────────────────────┤
│  • Photosensitivity Warning Screen (mandatory acceptance)           │
│  • Emergency Stop Button (always visible)                           │
│  • 2Hz Max Strobe Rate (below seizure threshold)                    │
│  • Gradual Intensity Transitions (no sudden flashes)                │
│  • Safe Audio Levels (0.3 master gain)                              │
│  • Pause Functionality (two hands together)                         │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────┘

Time (frame) ──┐
               │
               ▼
    ┌──────────────────────┐
    │  TripPhaseManager    │
    │  (calculates phase)  │
    └──────────┬───────────┘
               │
               │ phase data (name, intensity, hue, progress)
               │
    ┌──────────▼───────────────────────────────────────┐
    │           Effects Update Loop                     │
    ├───────────────────────────────────────────────────┤
    │  1. Update audio frequencies based on phase       │
    │  2. Get hand/mouse input data                     │
    │  3. Calculate gesture intensities                 │
    │  4. Update shader uniforms                        │
    │  5. Animate fractals (rotation, scale, color)     │
    │  6. Spawn hand trail particles                    │
    │  7. Cleanup old particles (periodic)              │
    │  8. Render scene                                  │
    └───────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     PERFORMANCE OPTIMIZATIONS                        │
├─────────────────────────────────────────────────────────────────────┤
│  • Hand trail cleanup: 500ms intervals (not per-frame)              │
│  • Limited particle count for mobile GPU                            │
│  • Efficient data structures (object vs array mixing)               │
│  • Optimized shader complexity                                      │
│  • Proper resource disposal                                         │
│  • Reduced fractal iteration depth                                  │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE TIMELINE (15 minutes)                      │
├─────────────────────────────────────────────────────────────────────┤
│  0:00 ─────► 3:00 ─────► 8:00 ─────► 12:00 ─────► 15:00            │
│   │            │           │            │            │               │
│   │    ONSET   │    PEAK   │  PLATEAU   │ COMEDOWN   │  (loop)      │
│   │    3 min   │   5 min   │   4 min    │   3 min    │              │
│   │            │           │            │            │               │
│   │  Theta     │  Alpha→   │  High      │  Beta→     │              │
│   │  4-8Hz     │  Beta     │  Beta      │  Theta     │              │
│   │  30% int   │  8-30Hz   │  30-40Hz   │  30-8Hz    │              │
│   │            │  100% int │  90% int   │  40% int   │              │
└─────────────────────────────────────────────────────────────────────┘
```
