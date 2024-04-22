import * as THREE from 'three';
import { MTLLoader } from './build/loaders/MTLLoader.js';
import { OBJLoader } from './build/loaders/OBJLoader.js';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, velocity, moveBackward, moveForward, moveRight, moveLeft } from './sceneSetup.js';
import { animate } from './animate.js';
import { Reflector } from './build/misc/Reflector.js';

// GLTF loader for models
const gltfLoader = new GLTFLoader();

// Add lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let groundMirror;
let geometry, material;

// geometry = new THREE.CircleGeometry( 40, 64 );
// groundMirror = new Reflector( geometry, {
//     clipBias: 0.003,
//     textureWidth: window.innerWidth * window.devicePixelRatio,
//     textureHeight: window.innerHeight * window.devicePixelRatio,
//     color: 0xb5b5b5
// } );
// groundMirror.position.y = 0.5;
// groundMirror.rotateX( - Math.PI / 2 );
// scene.add( groundMirror );

// Function to load models
const loadGLTFModel = (modelPath, scale, position) => {
    gltfLoader.load(modelPath, (gltfScene) => {
        gltfScene.scene.traverse(function (child) {
            if (child.isMesh && child.name === 'Object_5338') {  // Specific name for the water mesh
                // Update material properties for reflectivity if possible
                if (child.material && (child.material instanceof THREE.MeshPhongMaterial || child.material instanceof THREE.MeshStandardMaterial)) {
                    // Directly modify existing material properties
                    child.material.envMap = scene.background;
                    child.material.reflectivity = 0.2;
                    child.material.shininess = 50; // Only for Phong material
                } else {
                    // Upgrade material to support reflectivity
                    child.material = new THREE.MeshPhongMaterial({
                        map: child.material.map, // Preserve any assigned textures
                        color: child.material.color, // Preserve the original color
                        envMap: scene.background,
                        reflectivity: 0.8,
                        shininess: 100
                    });
                }
                child.castShadow = false;
                child.receiveShadow = false;
            } else if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        gltfScene.scene.scale.set(scale, scale, scale);
        gltfScene.scene.position.set(position.x, position.y, position.z);
        scene.add(gltfScene.scene);
    });
};

loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, { x: 0, y: 0, z: 0 });

animate();