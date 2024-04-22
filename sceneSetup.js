import * as THREE from 'three';
import { PointerLockControls } from './build/controls/PointerLockControls.js';

// Scene setup
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.x = 20;
camera.position.z = 40;

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

camera.lookAt(0, 0, 0);

// Lighting
// var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
// scene.add(ambientLight);

// var directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
// directionalLight.position.set(0, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.near = 0.5;
// directionalLight.shadow.camera.far = 100;
// directionalLight.shadow.camera.left = -50;
// directionalLight.shadow.camera.right = 50;
// directionalLight.shadow.camera.top = 50;
// directionalLight.shadow.camera.bottom = -50;
// scene.add(directionalLight);

export var controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => controls.lock());


// Movement variables
export var moveForward = false;
export var moveBackward = false;
export var moveLeft = false;
export var moveRight = false;
export var velocity = new THREE.Vector3();

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
