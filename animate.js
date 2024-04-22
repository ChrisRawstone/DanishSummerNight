import * as THREE from 'three';
import { scene, controls, camera, renderer, moveForward, moveBackward, moveLeft, moveRight, velocity } from './sceneSetup.js';


// Animation loop
export function animate () {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        var delta = 0.1;
        velocity.x -= velocity.x * 1.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;

        if (moveForward) velocity.z -= 5.0 * delta;
        if (moveBackward) velocity.z += 5.0 * delta;
        if (moveLeft) velocity.x += 5.0 * delta;
        if (moveRight) velocity.x -= 5.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }


    renderer.render(scene, camera);
};