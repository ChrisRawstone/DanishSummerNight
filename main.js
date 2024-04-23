import * as THREE from 'three';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, velocity, moveBackward, moveForward, moveRight, moveLeft, params} from './sceneSetup.js';
import { animate } from './animate.js';
import { Water } from 'three/addons/objects/Water2.js';



import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI();

const settings = {
    timeOfDay: 0.5  // Range between 0 (night) and 1 (day)
};

gui.add(settings, 'timeOfDay', 0, 1).name('Time of Day').onChange(updateLighting);

let sunLight = new THREE.DirectionalLight(0xffffff, 1.0); // White light, full intensity
sunLight.position.set(100, 100, 100);
scene.add(sunLight);




let ambientLight = new THREE.HemisphereLight(0x666666, 0x000000, 0.3); // Soft light from above
scene.add(ambientLight);

function updateLighting(value) {
    const intensity = value * 0.9 + 0.1; // Ensures some light during "night"
    sunLight.intensity = intensity;

    // Update light color
    const nightColor = new THREE.Color(0x5555ff);
    const dayColor = new THREE.Color(0xffffff);
    sunLight.color.lerpColors(nightColor, dayColor, value);

    // Update the sun position
    const angle = Math.PI * (1 - value); // 0 = sunset (west), PI = sunrise (east)
    sunLight.position.set(100 * Math.cos(angle), 100 * Math.sin(angle), 100 * Math.sin(angle / 2));
    sunMesh.position.copy(sunLight.position);

    // Update ambient light and background color
    ambientLight.intensity = 0.3 + value * 0.2;
    scene.background.lerpColors(new THREE.Color(0x000022), new THREE.Color(0x87ceeb), value);
}



const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 }); // Bright yellow
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.layers.set(0); // Default rendering layer
scene.add(sunMesh);


sunLight.castShadow = true;
renderer.shadowMap.enabled = true;
sunMesh.castShadow = false; // The sun itself does not cast a shadow
sunMesh.receiveShadow = false;


const waterGeometry = new THREE.PlaneGeometry( 200, 200 );
export var water = new Water( waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
    textureWidth: 1024,
    textureHeight: 1024,

} );
water.position.y = -3;
water.rotation.x = Math.PI * - 0.5;
scene.add( water );





// GLTF loader for models
const gltfLoader = new GLTFLoader();
const loader = new GLTFLoader();

const loadGLTFModel = (modelPath, scale, position) => {
    gltfLoader.load(modelPath, (gltfScene) => {
        gltfScene.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Object_5338") {
                child.parent.remove(child);  // Remove Object_5338 from the scene
            } else {
                child.receiveShadow = true;
            }
        });
        gltfScene.scene.scale.set(scale, scale, scale);
        gltfScene.scene.position.set(position.x, position.y, position.z);
        scene.add(gltfScene.scene);
    });
};



loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, { x: 0, y: 0, z: 0 })



const torusKnotGeometry = new THREE.TorusKnotGeometry( 3, 1, 256, 32 );
const torusKnotMaterial = new THREE.MeshNormalMaterial();

var torusKnot = new THREE.Mesh( torusKnotGeometry, torusKnotMaterial );
torusKnot.position.y = 4;
torusKnot.scale.set( 0.5, 0.5, 0.5 );
scene.add( torusKnot );




updateLighting(settings.timeOfDay);





animate();
