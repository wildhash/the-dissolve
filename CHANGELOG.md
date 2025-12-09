# Changelog

All notable changes to The Dissolve project will be documented in this file.

## [1.1.0] - 2025-12-09

### Security
- **Fixed**: Updated Vite from v5.0.0 to v7.2.7 to address 2 moderate security vulnerabilities
  - CVE: esbuild vulnerability allowing unauthorized request/response access
  - All dependencies now have zero known vulnerabilities

### Improved
- **Build System**: Upgraded to Vite 7.x
  - Removed CJS deprecation warnings
  - Faster build times
  - Modern ESM-only architecture
  - Better tree-shaking and optimization

### Added
- **Automated Deployment**: GitHub Actions workflow for automatic deployment to GitHub Pages
- **Netlify Configuration**: Optimized `netlify.toml` with security headers and WebXR-specific settings
- **Documentation**: Enhanced DEPLOYMENT.md with automated deployment instructions
- **CI/CD**: Continuous deployment pipeline configured

### Configuration
- Security headers added for production deployments:
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Cross-Origin policies for improved security

## [1.0.0] - Initial Release

### Features
- Quest 3 MR psychedelic experience
- WebXR integration with hand tracking
- 4-phase trip progression system
- Binaural entrainment (4-40Hz)
- Shepard tones audio illusion
- Fractal geometry rendering
- Melting reality shader effects
- Hand trail particles
- Emergency stop functionality
- Photosensitivity warnings
- Desktop demo mode

### Technical
- Built with Three.js v0.160.0
- WebXR Device API integration
- WebXR Hand Input support
- Web Audio API for binaural beats
- Custom GLSL shaders
- Vite build system
