
import * as THREE from 'three';
import { MTLLoader } from './build/loaders/MTLLoader.js';
import { OBJLoader } from './build/loaders/OBJLoader.js';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene } from './sceneSetup.js';



// Controls




// Ground
var groundTexture = new THREE.TextureLoader().load('textures/jungleground_texture.jpeg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);
var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
var groundGeometry = new THREE.PlaneGeometry(500, 500);
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Load and add trees and other objects with shadow settings
const gltfLoader = new GLTFLoader();
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

loadGLTFModel('models/oak_trees/scene.gltf', 20, { x: 0, y: 0, z: -30 });
loadGLTFModel('models/jungle_tree/scene.gltf', 1, { x: 25, y: 0, z: -30 });
loadGLTFModel('models/realistic_jungle_tree_avatar/scene.gltf', 0.5, { x: 0, y: 0, z: 0 });

// Movement variables
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var velocity = new THREE.Vector3();

// Key events
var onKeyDown = function (event) {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            moveForward = true;
            break;
        case 'a':
        case 'ArrowLeft':
            moveLeft = true;
            break;
        case 's':
        case 'ArrowDown':
            moveBackward = true;
            break;
        case 'd':
        case 'ArrowRight':
            moveRight = true;
            break;
    }
};

var onKeyUp = function (event) {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            moveForward = false;
            break;
        case 'a':
        case 'ArrowLeft':
            moveLeft = false;
            break;
        case 's':
        case 'ArrowDown':
            moveBackward = false;
            break;
        case 'd':
        case 'ArrowRight':
            moveRight = false;  
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

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
