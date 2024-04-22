import * as THREE from 'three';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { Reflector } from './build/misc/Reflector.js';
import { scene, camera, renderer, controls, velocity, moveBackward, moveForward, moveRight, moveLeft } from './sceneSetup.js';
import { animate } from './animate.js';

// GLTF loader for models
const gltfLoader = new GLTFLoader();

// Add lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Ground mirror setup
let geometry = new THREE.CircleGeometry(40, 64);
let groundMirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
});
groundMirror.position.y = 0.5;
groundMirror.rotateX(-Math.PI / 2);
scene.add(groundMirror);

// Function to load models
const loadGLTFModel = (modelPath, scale, position) => {
    gltfLoader.load(modelPath, (gltfScene) => {
        gltfScene.scene.traverse(function (child) {
            if (child.isMesh) {
                if (child.material && (child.material instanceof THREE.MeshPhongMaterial || child.material instanceof THREE.MeshStandardMaterial)) {
                    child.material.envMap = scene.background;
                    child.material.reflectivity = 0.2;
                    child.material.shininess = 50;
                } else {
                    child.material = new THREE.MeshPhongMaterial({
                        color: child.material.color,
                        envMap: scene.background,
                        reflectivity: 0.8,
                        shininess: 100
                    });
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        gltfScene.scene.scale.set(scale, scale, scale);
        gltfScene.scene.position.set(position.x, position.y, position.z);
        scene.add(gltfScene.scene);
    });
};

loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, new THREE.Vector3(0, 0, 0));

animate();
