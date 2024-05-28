// Import necessary Three.js components
import * as THREE from 'three';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, params, moveForward, moveBackward, moveLeft, moveRight, velocity } from './sceneSetup.js';
// import  * as fs from './Fire.js';
// import { animate } from './animate.js';
import { createFireflies, addBonfire, water, tube, createStars, setupFire, setupMoon} from './objects.js';




var fire = setupFire(scene);
scene.add(fire);

// Call createStars function to add stars to the sky
createStars();


setupMoon(scene);



// Setup the GUI for dynamic settings
const gui = new GUI();
const settings = {
    timeOfDay: 0.001  // Controls the time of day from 0 (night) to 1 (day)
};
gui.add(settings, 'timeOfDay', 0, 1).name('Time of Day').onChange(updateLighting);

// Configure directional sunlight
let sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
sunLight.position.set(100, 100, 100);
sunLight.castShadow = true;
scene.add(sunLight);

// Add a spotlight to simulate the sun more dynamically
let sunSpotlight = new THREE.SpotLight(0xffffff, 1.0, 500, Math.PI / 4, 0.5, 2);
sunSpotlight.position.set(100, 100, 100);
sunSpotlight.target.position.set(0, 0, 0);
sunSpotlight.castShadow = true;
scene.add(sunSpotlight);
scene.add(sunSpotlight.target);

// Enable shadow mapping in the renderer for better shadow effects
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add ambient light for softer light addition
let ambientLight = new THREE.HemisphereLight(0x666666, 0x000000, 0.3);
scene.add(ambientLight);

// Function to update lighting based on GUI control
function updateLighting(value) {
    sunLight.intensity = value * 0.9 + 0.1;
    sunSpotlight.intensity = value * 0.9 + 0.1; // Sync spotlight intensity with the directional light

    const nightColor = new THREE.Color(0x5555ff);
    const dayColor = new THREE.Color(0xffffff);
    sunLight.color.lerpColors(nightColor, dayColor, value);
    sunSpotlight.color.copy(sunLight.color); // Match the spotlight color with the directional light

    const angle = Math.PI * (1 - value);
    sunLight.position.set(100 * Math.cos(angle), 100 * Math.sin(angle), 100 * Math.sin(angle / 2));
    sunSpotlight.position.copy(sunLight.position); // Match the spotlight position with the directional light
    sunSpotlight.target.position.set(0, 0, 0); // Spotlight aims at the scene's center

    ambientLight.intensity = 0;
    // ambientLight.intensity = 0.3 + value * 0.2;
    scene.background.lerpColors(new THREE.Color(0x000022), new THREE.Color(0x87ceeb), value);
}






// GLTF loader for models
const gltfLoader = new GLTFLoader();
const loader = new GLTFLoader();

const loadGLTFModel = (modelPath, scale, position) => {
    gltfLoader.load(modelPath, (gltfScene) => {
        gltfScene.scene.traverse(function (child) {
            if (child.name === "Object_5338") {
                child.parent.remove(child);  // Remove Object_5338 from the scene
            } else {
                child.receiveShadow = true;
                child.castShadow = true;
            }
            child.receiveShadow = true;
            child.castShadow = true;
        });
        gltfScene.scene.scale.set(scale, scale, scale);
        gltfScene.scene.position.set(position.x, position.y, position.z);
        scene.add(gltfScene.scene);
    });
};

loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, { x: 0, y: 0, z: 0 });


// Initiate the lighting update and start the animation loop
updateLighting(settings.timeOfDay);




// Declare fireLight at a broader scope
sunLight.shadow.mapSize.width = 2048;  // Higher resolution for shadow map
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.bias = -0.0001;  // Adjust bias to avoid self-shadowing artifacts

sunSpotlight.shadow.mapSize.width = 2048;
sunSpotlight.shadow.mapSize.height = 2048;
sunSpotlight.shadow.bias = -0.0001;


// Set up the bonfire
const fireflies = createFireflies(scene, 5);
const { bonfire, fireLight } = addBonfire({ x: 10, y: -2, z: 30 }, 1.5);
scene.add(bonfire); // Add bonfire to the scene
scene.add( tube );
scene.add(water);



// Setup raycaster and mouse for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;

// Function to handle mouse down event
function onMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0 && intersects[0].object === bonfire) {
        isDragging = true;
    }
}

// Function to handle mouse move event
function onMouseMove(event) {
    if (!isDragging) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([groundPlane]); // assuming `groundPlane` is your ground mesh

    if (intersects.length > 0) {
        bonfire.position.copy(intersects[0].point);
    }
}

// Function to handle mouse up event
function onMouseUp(event) {
    isDragging = false;
}

// Add mouse event listeners
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);




function animate() {
    requestAnimationFrame(animate);

    const delta = 0.01; // Time step for movement calculations

    fire.update(performance.now() / 1000);
    // Update each firefly's position
    fireflies.forEach(firefly => firefly.move(0.01));


    // Existing lighting and control logic remains the same
    if (fireLight) {
        fireLight.intensity = 50 + Math.random() * 100;  // Flickering effect
    }

    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;
        if (moveLeft) velocity.x += 400.0 * delta;
        if (moveRight) velocity.x -= 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }

    renderer.render(scene, camera);
}

animate();
