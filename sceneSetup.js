import * as THREE from 'three';
import { PointerLockControls } from './build/controls/PointerLockControls.js';

// Scene setup
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.x = 20;
camera.position.z = 40;


export var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight( 0xe7e7e7, 1.2 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
directionalLight.position.set( - 1, 1, 1 );
scene.add( directionalLight );


// christian add directional light til dig

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



export const params = {
    color: '#ffffff',
    scale: 4,
    flowX: 1,
    flowY: 1
};



