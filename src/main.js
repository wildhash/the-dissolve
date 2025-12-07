import * as THREE from 'three';
import { HandTracking } from './HandTracking.js';
import { AudioEngine } from './AudioEngine.js';
import { ShaderEffects } from './ShaderEffects.js';
import { FractalGeometry } from './FractalGeometry.js';
import { TripPhaseManager } from './TripPhaseManager.js';

class TheDissolve {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.xrSession = null;
        this.handTracking = null;
        this.audioEngine = null;
        this.shaderEffects = null;
        this.fractalGeometry = null;
        this.phaseManager = null;
        this.isRunning = false;
        this.handTrails = [];
        this.emergencyStop = false;
    }

    async init() {
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 0);

        // Setup renderer with XR support
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true;
        
        document.getElementById('app').appendChild(this.renderer.domElement);

        // Initialize subsystems
        this.handTracking = new HandTracking(this.scene, this.camera);
        this.audioEngine = new AudioEngine();
        this.shaderEffects = new ShaderEffects(this.scene, this.renderer);
        this.fractalGeometry = new FractalGeometry(this.scene);
        this.phaseManager = new TripPhaseManager();

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Setup XR button
        this.setupXRButton();

        // Setup emergency stop
        document.getElementById('emergency-stop').addEventListener('click', () => {
            this.emergencyStop = true;
            this.stop();
        });

        console.log('The Dissolve initialized');
    }

    setupXRButton() {
        const button = document.createElement('button');
        button.id = 'xr-button';
        button.textContent = 'ENTER VR';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '100';
        button.style.padding = '15px 30px';
        button.style.fontSize = '1.2em';
        button.style.background = '#00ff00';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '10px';

        button.addEventListener('click', async () => {
            if (this.renderer.xr.isPresenting) {
                await this.xrSession.end();
            } else {
                await this.startXR();
            }
        });

        document.body.appendChild(button);

        // Check if XR is supported
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                if (!supported) {
                    button.textContent = 'XR NOT SUPPORTED';
                    button.disabled = true;
                }
            });
        } else {
            button.textContent = 'XR NOT AVAILABLE';
            button.disabled = true;
        }
    }

    async startXR() {
        try {
            this.xrSession = await navigator.xr.requestSession('immersive-vr', {
                optionalFeatures: ['hand-tracking', 'local-floor']
            });

            await this.renderer.xr.setSession(this.xrSession);
            
            // Start the experience
            this.start();
            
            this.xrSession.addEventListener('end', () => {
                this.stop();
            });

        } catch (error) {
            console.error('Failed to start XR session:', error);
            alert('Failed to start VR. Make sure you are on a Quest 3 device.');
        }
    }

    start() {
        this.isRunning = true;
        this.audioEngine.start();
        this.phaseManager.start();
        this.fractalGeometry.generate();
        this.animate();
        console.log('Experience started');
    }

    stop() {
        this.isRunning = false;
        this.audioEngine.stop();
        this.phaseManager.stop();
        this.shaderEffects.reset();
        
        if (this.emergencyStop) {
            // Fade to black and show safe message
            this.renderer.domElement.style.transition = 'opacity 0.5s';
            this.renderer.domElement.style.opacity = '0';
            
            setTimeout(() => {
                if (this.xrSession) {
                    this.xrSession.end();
                }
                alert('Experience stopped. Remove headset if needed. Take your time to recover.');
            }, 500);
        }
        
        console.log('Experience stopped');
    }

    animate() {
        if (!this.isRunning) return;

        this.renderer.setAnimationLoop((time, frame) => {
            if (!this.isRunning) {
                this.renderer.setAnimationLoop(null);
                return;
            }

            const deltaTime = time / 1000; // Convert to seconds
            
            // Update phase
            const phase = this.phaseManager.update(deltaTime);
            
            // Update phase indicator
            const phaseText = document.getElementById('phase-text');
            if (phaseText) {
                phaseText.textContent = phase.name.toUpperCase();
            }

            // Update hand tracking
            if (frame) {
                const handData = this.handTracking.update(frame);
                
                // Update effects based on hand gestures
                if (handData) {
                    this.updateEffectsFromHands(handData, phase);
                }
            }

            // Update audio based on phase
            this.audioEngine.update(phase);

            // Update shader effects
            this.shaderEffects.update(deltaTime, phase);

            // Update fractals
            this.fractalGeometry.update(deltaTime, phase);

            // Render scene
            this.renderer.render(this.scene, this.camera);
        });
    }

    updateEffectsFromHands(handData, phase) {
        const { leftHand, rightHand } = handData;
        
        // Calculate gesture intensities
        let intensity = phase.intensity;
        let distortion = 0;
        let spread = 0;

        if (leftHand && leftHand.pinching) {
            intensity *= 1.5;
        }

        if (rightHand && rightHand.pinching) {
            intensity *= 1.5;
        }

        if (leftHand && leftHand.open) {
            spread += 0.5;
        }

        if (rightHand && rightHand.open) {
            spread += 0.5;
        }

        // Check for pause gesture (both hands together)
        if (leftHand && rightHand) {
            const distance = leftHand.position.distanceTo(rightHand.position);
            if (distance < 0.2) {
                this.phaseManager.pause();
            }
        }

        // Update shader effects
        this.shaderEffects.setIntensity(intensity);
        this.shaderEffects.setDistortion(distortion);
        this.shaderEffects.setSpread(spread);

        // Create hand trails
        this.createHandTrails(leftHand, rightHand, phase);
    }

    createHandTrails(leftHand, rightHand, phase) {
        const hands = [leftHand, rightHand].filter(h => h !== null);
        
        hands.forEach(hand => {
            // Create energy trail particle
            const geometry = new THREE.SphereGeometry(0.02, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(phase.hue, 1, 0.5),
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(hand.position);
            particle.userData.createdAt = Date.now();
            particle.userData.lifetime = 1000; // 1 second
            
            this.scene.add(particle);
            this.handTrails.push(particle);
        });

        // Clean up old trails
        this.handTrails = this.handTrails.filter(trail => {
            const age = Date.now() - trail.userData.createdAt;
            if (age > trail.userData.lifetime) {
                this.scene.remove(trail);
                trail.geometry.dispose();
                trail.material.dispose();
                return false;
            }
            
            // Fade out
            trail.material.opacity = 1 - (age / trail.userData.lifetime);
            return true;
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize app after warning accepted
document.getElementById('accept-btn').addEventListener('click', async () => {
    document.getElementById('warning-screen').classList.add('hidden');
    
    const app = new TheDissolve();
    await app.init();
    
    // For non-VR testing, start immediately
    if (!navigator.xr) {
        app.start();
    }
});
