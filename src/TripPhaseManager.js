export class TripPhaseManager {
    constructor() {
        this.phases = [
            {
                name: 'onset',
                duration: 180, // 3 minutes
                intensity: 0.3,
                description: 'Reality begins to shift'
            },
            {
                name: 'peak',
                duration: 300, // 5 minutes
                intensity: 1.0,
                description: 'Full immersion in the experience'
            },
            {
                name: 'plateau',
                duration: 240, // 4 minutes
                intensity: 0.9,
                description: 'Sustained altered state'
            },
            {
                name: 'comedown',
                duration: 180, // 3 minutes
                intensity: 0.4,
                description: 'Gradual return to baseline'
            }
        ];
        
        this.currentPhaseIndex = 0;
        this.phaseStartTime = 0;
        this.totalElapsed = 0;
        this.isActive = false;
        this.isPaused = false;
    }

    start() {
        this.currentPhaseIndex = 0;
        this.phaseStartTime = Date.now();
        this.totalElapsed = 0;
        this.isActive = true;
        this.isPaused = false;
        console.log('Trip phases started');
    }

    stop() {
        this.isActive = false;
        this.isPaused = false;
        console.log('Trip phases stopped');
    }

    pause() {
        this.isPaused = !this.isPaused;
        console.log('Trip phases', this.isPaused ? 'paused' : 'resumed');
    }

    update(deltaTime) {
        if (!this.isActive || this.isPaused) {
            return this.getCurrentPhase();
        }

        // Calculate elapsed time in current phase
        const now = Date.now();
        const elapsed = (now - this.phaseStartTime) / 1000; // Convert to seconds
        
        const currentPhase = this.phases[this.currentPhaseIndex];
        
        // Check if we should move to next phase
        if (elapsed >= currentPhase.duration) {
            this.nextPhase();
        }

        return this.getCurrentPhase();
    }

    nextPhase() {
        this.currentPhaseIndex++;
        
        // Loop back to beginning after comedown
        if (this.currentPhaseIndex >= this.phases.length) {
            this.currentPhaseIndex = 0;
        }
        
        this.phaseStartTime = Date.now();
        
        const phase = this.phases[this.currentPhaseIndex];
        console.log(`Entering phase: ${phase.name} - ${phase.description}`);
    }

    getCurrentPhase() {
        const phase = this.phases[this.currentPhaseIndex];
        const elapsed = (Date.now() - this.phaseStartTime) / 1000;
        const progress = Math.min(elapsed / phase.duration, 1);
        
        // Calculate smooth intensity transition
        let intensity = phase.intensity;
        
        // Ease in/out for smoother transitions
        if (progress < 0.1) {
            // Ease in
            const easeProgress = progress / 0.1;
            const prevPhaseIndex = (this.currentPhaseIndex - 1 + this.phases.length) % this.phases.length;
            const prevIntensity = this.phases[prevPhaseIndex].intensity;
            intensity = prevIntensity + (phase.intensity - prevIntensity) * easeProgress;
        } else if (progress > 0.9) {
            // Ease out
            const easeProgress = (progress - 0.9) / 0.1;
            const nextPhaseIndex = (this.currentPhaseIndex + 1) % this.phases.length;
            const nextIntensity = this.phases[nextPhaseIndex].intensity;
            intensity = phase.intensity + (nextIntensity - phase.intensity) * easeProgress;
        }
        
        // Add subtle oscillation for organic feel
        const oscillation = Math.sin(Date.now() / 1000) * 0.05;
        intensity = Math.max(0, Math.min(1, intensity + oscillation));
        
        // Calculate hue based on phase
        const hue = (this.currentPhaseIndex / this.phases.length + progress * 0.2) % 1;
        
        return {
            name: phase.name,
            description: phase.description,
            intensity: intensity,
            progress: progress,
            hue: hue,
            timeRemaining: phase.duration - elapsed
        };
    }

    getPhaseInfo() {
        const phase = this.getCurrentPhase();
        return {
            current: this.currentPhaseIndex + 1,
            total: this.phases.length,
            name: phase.name,
            progress: phase.progress,
            timeRemaining: Math.ceil(phase.timeRemaining)
        };
    }

    skipToPhase(index) {
        if (index >= 0 && index < this.phases.length) {
            this.currentPhaseIndex = index;
            this.phaseStartTime = Date.now();
            console.log(`Skipped to phase: ${this.phases[index].name}`);
        }
    }
}
