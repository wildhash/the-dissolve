import * as THREE from 'three';

export class ShaderEffects {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.composer = null;
        this.meltShader = null;
        this.intensity = 0;
        this.distortion = 0;
        this.spread = 0;
        this.time = 0;
        
        this.setupPostProcessing();
    }

    setupPostProcessing() {
        // Create fullscreen quad for post-processing
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // Melting reality shader
        const meltMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                time: { value: 0 },
                intensity: { value: 0 },
                distortion: { value: 0 },
                spread: { value: 0 },
                resolution: { 
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight) 
                }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform float intensity;
                uniform float distortion;
                uniform float spread;
                uniform vec2 resolution;
                varying vec2 vUv;

                // Noise function for organic distortion
                float noise(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }

                vec3 hueShift(vec3 color, float shift) {
                    float angle = shift * 3.14159265;
                    float s = sin(angle);
                    float c = cos(angle);
                    mat3 hueRotation = mat3(
                        0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s, 0.114 - 0.114 * c - 0.497 * s,
                        0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
                        0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s, 0.114 + 0.886 * c - 0.203 * s
                    );
                    return hueRotation * color;
                }

                void main() {
                    vec2 uv = vUv;
                    
                    // Melting effect - vertical wave distortion
                    float melt = sin(uv.x * 10.0 + time * 2.0) * intensity * 0.05;
                    uv.y += melt;
                    
                    // Radial distortion from center
                    vec2 center = vec2(0.5, 0.5);
                    vec2 toCenter = uv - center;
                    float dist = length(toCenter);
                    float radialDistortion = sin(dist * 20.0 - time * 3.0) * distortion * 0.02;
                    uv += normalize(toCenter) * radialDistortion;
                    
                    // Chromatic aberration
                    float aberration = intensity * 0.01;
                    vec2 direction = normalize(toCenter);
                    float r = texture2D(tDiffuse, uv + direction * aberration).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - direction * aberration).b;
                    
                    vec3 color = vec3(r, g, b);
                    
                    // Hue rotation over time
                    float hueShiftAmount = sin(time * 0.5) * intensity;
                    color = hueShift(color, hueShiftAmount);
                    
                    // Kaleidoscope effect based on spread
                    if (spread > 0.1) {
                        float angle = atan(toCenter.y, toCenter.x);
                        float segments = 6.0 + spread * 6.0;
                        float segmentAngle = 6.28318 / segments;
                        angle = mod(angle, segmentAngle * 2.0);
                        if (angle > segmentAngle) {
                            angle = segmentAngle * 2.0 - angle;
                        }
                        vec2 kaleidoUv = vec2(cos(angle), sin(angle)) * dist + center;
                        color = texture2D(tDiffuse, kaleidoUv).rgb;
                    }
                    
                    // Add noise grain
                    float grain = noise(uv * resolution * time) * 0.05 * intensity;
                    color += grain;
                    
                    // Vignette with pulsing
                    float vignette = 1.0 - dist * (0.5 + sin(time * 2.0) * 0.2 * intensity);
                    color *= vignette;
                    
                    // Color boost
                    color = pow(color, vec3(1.0 - intensity * 0.3));
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        this.meltShader = meltMaterial;
    }

    update(deltaTime, phase) {
        this.time += deltaTime;
        
        if (this.meltShader) {
            this.meltShader.uniforms.time.value = this.time;
            this.meltShader.uniforms.intensity.value = this.intensity * phase.intensity;
            this.meltShader.uniforms.distortion.value = this.distortion * phase.intensity;
            this.meltShader.uniforms.spread.value = this.spread * phase.intensity;
        }
    }

    setIntensity(value) {
        this.intensity = Math.max(0, Math.min(1, value));
    }

    setDistortion(value) {
        this.distortion = Math.max(0, Math.min(1, value));
    }

    setSpread(value) {
        this.spread = Math.max(0, Math.min(1, value));
    }

    reset() {
        this.intensity = 0;
        this.distortion = 0;
        this.spread = 0;
        this.time = 0;
    }

    applyToScene(renderTarget) {
        // This would be called in a post-processing pipeline
        // For now, effects are applied per-object
    }
}
