export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.binauralOscillators = null;
        this.shepardToneOscillators = [];
        this.masterGain = null;
        this.isPlaying = false;
        this.currentFrequency = 4; // Start at 4Hz (theta waves)
    }

    start() {
        if (this.isPlaying) return;

        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master gain control
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3; // Keep volume safe
        this.masterGain.connect(this.audioContext.destination);

        // Start binaural beats
        this.startBinauralBeats();

        // Start Shepard tones
        this.startShepardTones();

        this.isPlaying = true;
        console.log('Audio engine started');
    }

    stop() {
        if (!this.isPlaying) return;

        // Stop binaural oscillators
        if (this.binauralOscillators) {
            try {
                this.binauralOscillators.left.stop();
                this.binauralOscillators.right.stop();
            } catch (e) {
                // Already stopped
            }
            this.binauralOscillators = null;
        }

        // Stop Shepard tone oscillators
        this.shepardToneOscillators.forEach(tone => {
            try {
                tone.oscillator.stop();
            } catch (e) {
                // Already stopped
            }
        });
        this.shepardToneOscillators = [];

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.isPlaying = false;
        console.log('Audio engine stopped');
    }

    startBinauralBeats() {
        // Create binaural beat effect
        // Left ear - base frequency
        const leftOsc = this.audioContext.createOscillator();
        leftOsc.frequency.value = 200; // Base frequency in Hz
        leftOsc.type = 'sine';

        const leftGain = this.audioContext.createGain();
        leftGain.gain.value = 0.5;

        const leftPanner = this.audioContext.createStereoPanner();
        leftPanner.pan.value = -1; // Full left

        leftOsc.connect(leftGain);
        leftGain.connect(leftPanner);
        leftPanner.connect(this.masterGain);

        // Right ear - base + binaural frequency
        const rightOsc = this.audioContext.createOscillator();
        rightOsc.frequency.value = 200 + this.currentFrequency;
        rightOsc.type = 'sine';

        const rightGain = this.audioContext.createGain();
        rightGain.gain.value = 0.5;

        const rightPanner = this.audioContext.createStereoPanner();
        rightPanner.pan.value = 1; // Full right

        rightOsc.connect(rightGain);
        rightGain.connect(rightPanner);
        rightPanner.connect(this.masterGain);

        // Start oscillators
        leftOsc.start();
        rightOsc.start();

        // Store references properly
        this.binauralOscillators = {
            left: leftOsc,
            right: rightOsc,
            leftGain: leftGain,
            rightGain: rightGain
        };
    }

    startShepardTones() {
        // Create Shepard tone - illusion of infinitely ascending/descending pitch
        const baseFrequencies = [55, 110, 220, 440, 880, 1760, 3520]; // A notes across octaves
        
        baseFrequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            osc.frequency.value = freq;
            osc.type = 'sine';

            const gain = this.audioContext.createGain();
            // Gaussian envelope - louder in middle octaves
            const center = baseFrequencies.length / 2;
            const sigma = baseFrequencies.length / 4;
            const envelope = Math.exp(-Math.pow(index - center, 2) / (2 * sigma * sigma));
            gain.gain.value = envelope * 0.1; // Keep quiet

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();

            this.shepardToneOscillators.push({
                oscillator: osc,
                gain: gain,
                baseFreq: freq,
                index: index
            });
        });
    }

    update(phase) {
        if (!this.isPlaying || !this.audioContext) return;

        // Update binaural frequency based on phase
        // Theta (4-8Hz) -> Alpha (8-13Hz) -> Beta (13-30Hz) -> back to Theta
        let targetFrequency = 4;
        
        switch (phase.name) {
            case 'onset':
                // Theta waves - relaxation
                targetFrequency = 4 + (phase.progress * 4); // 4-8Hz
                break;
            case 'peak':
                // Alpha to Beta - heightened awareness
                targetFrequency = 8 + (phase.progress * 22); // 8-30Hz
                break;
            case 'plateau':
                // Beta waves - high intensity (but cap at 40Hz for safety)
                targetFrequency = Math.min(30 + (phase.progress * 10), 40); // 30-40Hz
                break;
            case 'comedown':
                // Back to Alpha then Theta
                targetFrequency = 30 - (phase.progress * 22); // 30-8Hz
                break;
        }

        // Smoothly transition frequency
        this.currentFrequency += (targetFrequency - this.currentFrequency) * 0.01;

        // Update binaural beat
        if (this.binauralOscillators && this.binauralOscillators.right) {
            this.binauralOscillators.right.frequency.value = 200 + this.currentFrequency;
        }

        // Update Shepard tones - create rising/falling effect
        const time = this.audioContext.currentTime;
        this.shepardToneOscillators.forEach((tone, index) => {
            // Slowly modulate frequency up
            const modulation = Math.sin(time * 0.1 + index) * 0.02;
            tone.oscillator.frequency.value = tone.baseFreq * (1 + modulation);
            
            // Modulate volume based on phase intensity
            const baseEnvelope = tone.gain.gain.value;
            tone.gain.gain.value = baseEnvelope * phase.intensity;
        });
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
}
