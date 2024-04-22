import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { MTLLoader } from './build/loaders/MTLLoader.js';
import { OBJLoader } from './build/loaders/OBJLoader.js';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';

// Create the scene
var scene = new THREE.Scene();
var ratio = window.innerWidth / window.innerHeight;

scene.background = new THREE.Color(0x87CEEB);

// Create the perspective camera
var camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
camera.position.set(2.51, 22.18, 87.64);
camera.lookAt(2.48, 21.93, 86.67);

// Enable shadows in the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
document.body.appendChild(renderer.domElement);

// OrbitControls for camera manipulation
var controls = new OrbitControls(camera, renderer.domElement);

// Load and configure the floor texture
var jungle_groundtexture = new THREE.TextureLoader().load('textures/jungleground_texture.jpeg', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(25, 25);
});

// Create the floor material and mesh
var floorMaterial = new THREE.MeshLambertMaterial({ map: jungle_groundtexture });
var floorGeometry = new THREE.PlaneGeometry(500, 500);
var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = -0.5;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// Ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Directional light from above
var directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
directionalLight.position.set(0, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

// Helper for debugging light shadows
var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);

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

// Load and configure tree house with shadows
var mtlLoader = new MTLLoader();
var objLoader = new OBJLoader();
mtlLoader.setPath('models/');
mtlLoader.load('tree_house/tree_house.mtl', function (materials) {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.setPath('models/');
    objLoader.load('tree_house/tree_house.obj', function (object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(object);
    });
});

// Resize function
var MyResize = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
};

window.addEventListener('resize', MyResize);

// Update loop
var MyUpdateLoop = function () {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(MyUpdateLoop);
};

requestAnimationFrame(MyUpdateLoop);
