import * as THREE from 'three';

export class FractalGeometry {
    constructor(scene) {
        this.scene = scene;
        this.fractals = [];
        this.time = 0;
    }

    generate() {
        // Clear existing fractals
        this.fractals.forEach(fractal => {
            this.scene.remove(fractal.mesh);
            fractal.geometry.dispose();
            fractal.material.dispose();
        });
        this.fractals = [];

        // Create multiple fractal objects
        this.createSierpinskiTetrahedron();
        this.createMengerSponge();
        this.createJuliaSet();
        this.createSacredGeometry();
    }

    createSierpinskiTetrahedron() {
        // Recursive tetrahedron fractal
        const vertices = [];
        const colors = [];
        
        const addTetrahedron = (center, size, depth) => {
            if (depth === 0) {
                // Create tetrahedron vertices
                const h = size * Math.sqrt(2/3);
                const r = size * Math.sqrt(3) / 3;
                
                const v1 = new THREE.Vector3(center.x, center.y + h, center.z);
                const v2 = new THREE.Vector3(center.x + r * Math.cos(0), center.y - h/3, center.z + r * Math.sin(0));
                const v3 = new THREE.Vector3(center.x + r * Math.cos(2*Math.PI/3), center.y - h/3, center.z + r * Math.sin(2*Math.PI/3));
                const v4 = new THREE.Vector3(center.x + r * Math.cos(4*Math.PI/3), center.y - h/3, center.z + r * Math.sin(4*Math.PI/3));
                
                // Add triangles
                [v1, v2, v3, v1, v2, v4, v1, v3, v4, v2, v3, v4].forEach(v => {
                    vertices.push(v.x, v.y, v.z);
                    colors.push(Math.random(), Math.random(), Math.random());
                });
                return;
            }
            
            const newSize = size / 2;
            const h = size * Math.sqrt(2/3);
            const r = size * Math.sqrt(3) / 3;
            
            // Create 4 smaller tetrahedrons
            addTetrahedron(new THREE.Vector3(center.x, center.y + h/2, center.z), newSize, depth - 1);
            addTetrahedron(new THREE.Vector3(center.x + r/2 * Math.cos(0), center.y - h/6, center.z + r/2 * Math.sin(0)), newSize, depth - 1);
            addTetrahedron(new THREE.Vector3(center.x + r/2 * Math.cos(2*Math.PI/3), center.y - h/6, center.z + r/2 * Math.sin(2*Math.PI/3)), newSize, depth - 1);
            addTetrahedron(new THREE.Vector3(center.x + r/2 * Math.cos(4*Math.PI/3), center.y - h/6, center.z + r/2 * Math.sin(4*Math.PI/3)), newSize, depth - 1);
        };
        
        addTetrahedron(new THREE.Vector3(0, 1.5, -3), 0.5, 2);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        
        this.fractals.push({ mesh, geometry, material });
    }

    createMengerSponge() {
        // Simplified Menger sponge using cubes
        const cubes = [];
        
        const addCube = (x, y, z, size, depth) => {
            if (depth === 0) {
                const geometry = new THREE.BoxGeometry(size, size, size);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                    transparent: true,
                    opacity: 0.6,
                    wireframe: true
                });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(x, y, z);
                cubes.push({ mesh: cube, geometry, material });
                return;
            }
            
            const newSize = size / 3;
            // Create 20 cubes (27 - 7 removed from center)
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 3; k++) {
                        // Skip center cubes
                        const centerCount = (i === 1 ? 1 : 0) + (j === 1 ? 1 : 0) + (k === 1 ? 1 : 0);
                        if (centerCount >= 2) continue;
                        
                        const newX = x + (i - 1) * newSize;
                        const newY = y + (j - 1) * newSize;
                        const newZ = z + (k - 1) * newSize;
                        addCube(newX, newY, newZ, newSize, depth - 1);
                    }
                }
            }
        };
        
        addCube(-2, 1.5, -3, 0.6, 1);
        
        cubes.forEach(cube => {
            this.scene.add(cube.mesh);
            this.fractals.push(cube);
        });
    }

    createJuliaSet() {
        // 3D Julia set visualization using particles
        const particles = [];
        const particleCount = 1000;
        
        const c = new THREE.Vector2(-0.7, 0.27); // Julia set constant
        
        for (let i = 0; i < particleCount; i++) {
            // Random point in space
            const z = new THREE.Vector2(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            
            // Iterate Julia set
            let temp = z.clone();
            let escaped = false;
            for (let iter = 0; iter < 20; iter++) {
                const x = temp.x * temp.x - temp.y * temp.y + c.x;
                const y = 2 * temp.x * temp.y + c.y;
                temp.set(x, y);
                
                if (temp.length() > 2) {
                    escaped = true;
                    break;
                }
            }
            
            if (!escaped) {
                particles.push(z.x, z.y, Math.random() - 0.5);
            }
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xff00ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const points = new THREE.Points(geometry, material);
        points.position.set(2, 1.5, -3);
        this.scene.add(points);
        
        this.fractals.push({ mesh: points, geometry, material });
    }

    createSacredGeometry() {
        // Flower of Life pattern
        const radius = 0.3;
        const circles = [];
        
        // Center circle
        const center = new THREE.Vector3(0, 1, -2);
        
        // Create 6 surrounding circles
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const geometry = new THREE.TorusGeometry(radius, 0.01, 16, 32);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / 6, 1, 0.5),
                transparent: true,
                opacity: 0.7
            });
            
            const torus = new THREE.Mesh(geometry, material);
            torus.position.set(center.x + x, center.y, center.z + z);
            torus.rotation.x = Math.PI / 2;
            
            this.scene.add(torus);
            this.fractals.push({ mesh: torus, geometry, material });
        }
        
        // Center circle
        const centerGeometry = new THREE.TorusGeometry(radius, 0.01, 16, 32);
        const centerMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        });
        const centerTorus = new THREE.Mesh(centerGeometry, centerMaterial);
        centerTorus.position.copy(center);
        centerTorus.rotation.x = Math.PI / 2;
        this.scene.add(centerTorus);
        this.fractals.push({ mesh: centerTorus, geometry: centerGeometry, material: centerMaterial });
    }

    update(deltaTime, phase) {
        this.time += deltaTime;
        
        // Animate fractals
        this.fractals.forEach((fractal, index) => {
            // Rotate
            fractal.mesh.rotation.x += deltaTime * 0.2 * phase.intensity;
            fractal.mesh.rotation.y += deltaTime * 0.3 * phase.intensity;
            
            // Pulse scale
            const pulse = 1 + Math.sin(this.time * 2 + index) * 0.1 * phase.intensity;
            fractal.mesh.scale.set(pulse, pulse, pulse);
            
            // Color shift
            if (fractal.material.color) {
                const hue = (this.time * 0.1 + index * 0.1) % 1;
                fractal.material.color.setHSL(hue, 1, 0.5);
            }
            
            // Opacity pulse
            if (fractal.material.opacity !== undefined) {
                fractal.material.opacity = 0.5 + Math.sin(this.time * 3 + index) * 0.2 * phase.intensity;
            }
        });
    }

    dispose() {
        this.fractals.forEach(fractal => {
            this.scene.remove(fractal.mesh);
            fractal.geometry.dispose();
            fractal.material.dispose();
        });
        this.fractals = [];
    }
}
