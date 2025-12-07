import * as THREE from 'three';

export class HandTracking {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.leftHandMesh = null;
        this.rightHandMesh = null;
        this.joints = {};
    }

    update(frame) {
        if (!frame) return null;

        const referenceSpace = frame.session.referenceSpace;
        if (!referenceSpace) return null;

        let leftHand = null;
        let rightHand = null;

        // Try to get hand tracking data
        try {
            const inputSources = frame.session.inputSources;
            
            for (const inputSource of inputSources) {
                if (inputSource.hand) {
                    const hand = inputSource.hand;
                    const handData = this.processHand(hand, frame, referenceSpace);
                    
                    if (inputSource.handedness === 'left') {
                        leftHand = handData;
                    } else if (inputSource.handedness === 'right') {
                        rightHand = handData;
                    }
                }
            }
        } catch (error) {
            // Hand tracking not available, use controllers as fallback
            console.warn('Hand tracking not available:', error);
        }

        return { leftHand, rightHand };
    }

    processHand(hand, frame, referenceSpace) {
        const handData = {
            position: new THREE.Vector3(),
            joints: {},
            pinching: false,
            open: false,
            pointing: false
        };

        try {
            // Get wrist position as hand center
            const wristJoint = hand.get('wrist');
            if (wristJoint) {
                const wristPose = frame.getJointPose(wristJoint, referenceSpace);
                if (wristPose) {
                    handData.position.set(
                        wristPose.transform.position.x,
                        wristPose.transform.position.y,
                        wristPose.transform.position.z
                    );
                }
            }

            // Get thumb and index finger tips for pinch detection
            const thumbTip = hand.get('thumb-tip');
            const indexTip = hand.get('index-finger-tip');
            
            if (thumbTip && indexTip) {
                const thumbPose = frame.getJointPose(thumbTip, referenceSpace);
                const indexPose = frame.getJointPose(indexTip, referenceSpace);
                
                if (thumbPose && indexPose) {
                    const thumbPos = new THREE.Vector3(
                        thumbPose.transform.position.x,
                        thumbPose.transform.position.y,
                        thumbPose.transform.position.z
                    );
                    const indexPos = new THREE.Vector3(
                        indexPose.transform.position.x,
                        indexPose.transform.position.y,
                        indexPose.transform.position.z
                    );
                    
                    const distance = thumbPos.distanceTo(indexPos);
                    handData.pinching = distance < 0.03; // 3cm threshold
                }
            }

            // Detect open palm (all fingers extended)
            const fingerTips = [
                'index-finger-tip',
                'middle-finger-tip',
                'ring-finger-tip',
                'pinky-finger-tip'
            ];
            
            let extendedCount = 0;
            const palmPos = handData.position;
            
            for (const tipName of fingerTips) {
                const joint = hand.get(tipName);
                if (joint) {
                    const pose = frame.getJointPose(joint, referenceSpace);
                    if (pose) {
                        const tipPos = new THREE.Vector3(
                            pose.transform.position.x,
                            pose.transform.position.y,
                            pose.transform.position.z
                        );
                        const distance = palmPos.distanceTo(tipPos);
                        if (distance > 0.1) { // 10cm threshold for extended
                            extendedCount++;
                        }
                    }
                }
            }
            
            handData.open = extendedCount >= 3;

            // Detect pointing (index extended, others curled)
            if (indexTip) {
                const middleTip = hand.get('middle-finger-tip');
                if (middleTip) {
                    const indexPose = frame.getJointPose(indexTip, referenceSpace);
                    const middlePose = frame.getJointPose(middleTip, referenceSpace);
                    
                    if (indexPose && middlePose) {
                        const indexPos = new THREE.Vector3(
                            indexPose.transform.position.x,
                            indexPose.transform.position.y,
                            indexPose.transform.position.z
                        );
                        const middlePos = new THREE.Vector3(
                            middlePose.transform.position.x,
                            middlePose.transform.position.y,
                            middlePose.transform.position.z
                        );
                        
                        const indexDist = palmPos.distanceTo(indexPos);
                        const middleDist = palmPos.distanceTo(middlePos);
                        
                        handData.pointing = indexDist > 0.1 && middleDist < 0.08;
                    }
                }
            }

        } catch (error) {
            console.error('Error processing hand:', error);
        }

        return handData;
    }

    dispose() {
        // Clean up resources
        if (this.leftHandMesh) {
            this.scene.remove(this.leftHandMesh);
            this.leftHandMesh.geometry.dispose();
            this.leftHandMesh.material.dispose();
        }
        if (this.rightHandMesh) {
            this.scene.remove(this.rightHandMesh);
            this.rightHandMesh.geometry.dispose();
            this.rightHandMesh.material.dispose();
        }
    }
}
