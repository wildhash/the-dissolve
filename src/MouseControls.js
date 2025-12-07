import * as THREE from 'three';

export class MouseControls {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.isLeftClick = false;
        this.isRightClick = false;
        this.mousePosition = new THREE.Vector2();
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            this.mousePosition.set(this.mouseX, this.mouseY);
        });

        document.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                this.isLeftClick = true;
            } else if (event.button === 2) {
                this.isRightClick = true;
            }
        });

        document.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                this.isLeftClick = false;
            } else if (event.button === 2) {
                this.isRightClick = false;
            }
        });

        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    getHandData() {
        // Simulate hand data from mouse position
        const intensity = this.isLeftClick ? 1.5 : 1.0;
        const spread = this.isRightClick ? 1.0 : 0;
        
        // Create simulated left hand
        const leftHand = {
            position: new THREE.Vector3(this.mouseX - 0.2, this.mouseY, -1),
            pinching: this.isLeftClick,
            open: this.isRightClick,
            pointing: !this.isLeftClick && !this.isRightClick
        };

        // Create simulated right hand
        const rightHand = {
            position: new THREE.Vector3(this.mouseX + 0.2, this.mouseY, -1),
            pinching: this.isLeftClick,
            open: this.isRightClick,
            pointing: !this.isLeftClick && !this.isRightClick
        };

        return {
            leftHand: this.isLeftClick || this.isRightClick ? leftHand : null,
            rightHand: this.isLeftClick || this.isRightClick ? rightHand : null,
            intensity,
            spread
        };
    }

    dispose() {
        // Event listeners will be garbage collected
    }
}
