import * as THREE from 'three';
import { MTLLoader } from './build/loaders/MTLLoader.js';
import { OBJLoader } from './build/loaders/OBJLoader.js';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, velocity, moveBackward, moveForward, moveRight, moveLeft } from './sceneSetup.js';

// Ground setup
var groundTexture = new THREE.TextureLoader().load('textures/jungleground_texture.jpeg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);
var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
var groundGeometry = new THREE.PlaneGeometry(500, 500);
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// GLTF loader for models
const gltfLoader = new GLTFLoader();

// Function to load models
const loadGLTFModel = (path, scale, position) => {
    gltfLoader.load(path, (gltfScene) => {
        gltfScene.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        gltfScene.scene.scale.set(scale, scale, scale);
        gltfScene.scene.position.set(position.x, position.y, position.z);
        scene.add(gltfScene.scene);
    });
};

// Calculate positions for trees in a circle
const treeCount = 20;
const radius = 30;
for (let i = 0; i < treeCount; i++) {
    const angle = (i / treeCount) * 2 * Math.PI; // angle in radians
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    loadGLTFModel('models/jungle_tree/scene.gltf', 1, { x: x, y: 0, z: z });
}

// Animation loop
var animate = function () {
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

animate();
