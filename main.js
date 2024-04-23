import * as THREE from 'three';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, velocity, moveBackward, moveForward, moveRight, moveLeft } from './sceneSetup.js';
import { animate } from './animate.js';
import { Water } from 'three/addons/objects/Water2.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


const params = {
    color: '#ffffff',
    scale: 4,
    flowX: 1,
    flowY: 1
};

const waterGeometry = new THREE.PlaneGeometry( 20, 20 );

var water = new Water( waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
    textureWidth: 1024,
    textureHeight: 1024
} );

water.position.y = -5;
water.rotation.x = Math.PI * - 0.5;
scene.add( water );





// GLTF loader for models
const gltfLoader = new GLTFLoader();
const loader = new GLTFLoader();





// Function to load models
const loadGLTFModel = (modelPath, scale, position) => {
    gltfLoader.load(modelPath, (gltfScene) => {
        gltfScene.scene.traverse(function (child) {
            if (child.isMesh) {
                // child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        gltfScene.scene.scale.set(scale, scale, scale);
        gltfScene.scene.position.set(position.x, position.y, position.z);
        scene.add(gltfScene.scene);
    });
};

loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, { x: 0, y: 0, z: 0 })



// Tree model paths
const treeModels = [
    'models/jungle_tree/scene.gltf',
    'models/jungle_tree_2/scene.gltf',
    'models/oak_trees/scene.gltf',
    'models/realistic_jungle_tree_avatar/scene.gltf'
];


// Jungle tree and jungle tree 2 circle with radius 40
function generateJungleTreeCircles(radius, treeCount, angleOffset = 0) {
    for (let i = 0; i < treeCount; i++) {
        const angle = (i / treeCount) * 2 * Math.PI;
        const x = radius * Math.cos(angle+angleOffset);
        const z = radius * Math.sin(angle+angleOffset);
        const modelIndex = i % 2; // alternate between jungle_tree and jungle_tree_2
        
        loadGLTFModel(treeModels[modelIndex], 1, { x: x, y: 0, z: z });
    }
}

// generateJungleTreeCircles(40, 10); // Radius 40, 20 trees


// Oak trees circle
function generateOakTreeCircle(radius, treeCount) {
    for (let i = 0; i < treeCount; i++) {
        const angle = (i / treeCount) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        loadGLTFModel(treeModels[2], 30, { x: x, y: 0, z: z });
    }
}
// generateOakTreeCircle(70, 10); // Radius 70, 20 oak trees


loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, { x: 0, y: 0, z: 0 })





animate();
