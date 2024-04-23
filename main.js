// Import necessary Three.js components
import * as THREE from 'three';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { Water } from 'three/addons/objects/Water2.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, params, moveForward, moveBackward, moveLeft, moveRight, velocity } from './sceneSetup.js';
// import  * as fs from './Fire.js';
// import { animate } from './animate.js';



THREE.Fire = function ( fireTex, color ) {

	var fireMaterial = new THREE.ShaderMaterial( {
        defines         : THREE.FireShader.defines,
        uniforms        : THREE.UniformsUtils.clone( THREE.FireShader.uniforms ),
        vertexShader    : THREE.FireShader.vertexShader,
        fragmentShader  : THREE.FireShader.fragmentShader,
		transparent     : true,
		depthWrite      : false,
        depthTest       : false
	} );

    // initialize uniforms 

    fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
    fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping;
    
    fireMaterial.uniforms.fireTex.value = fireTex;
    fireMaterial.uniforms.color.value = color || new THREE.Color( 0xeeeeee );
    fireMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4();
    fireMaterial.uniforms.scale.value = new THREE.Vector3( 1, 1, 1 );
    fireMaterial.uniforms.seed.value = Math.random() * 19.19;

	THREE.Mesh.call( this, new THREE.BoxGeometry( 1.0, 1.0, 1.0 ), fireMaterial );
};

THREE.Fire.prototype = Object.create( THREE.Mesh.prototype );
THREE.Fire.prototype.constructor = THREE.Fire;

THREE.Fire.prototype.update = function ( time ) {

    var invModelMatrix = this.material.uniforms.invModelMatrix.value;

    this.updateMatrixWorld();
    invModelMatrix.getInverse( this.matrixWorld );

    if( time !== undefined ) {
        this.material.uniforms.time.value = time;
    }

    this.material.uniforms.invModelMatrix.value = invModelMatrix;

    this.material.uniforms.scale.value = this.scale;

};

// Setup the GUI for dynamic settings
const gui = new GUI();
const settings = {
    timeOfDay: 0.01  // Controls the time of day from 0 (night) to 1 (day)
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

    ambientLight.intensity = 0.3 + value * 0.2;
    scene.background.lerpColors(new THREE.Color(0x000022), new THREE.Color(0x87ceeb), value);
}

// Continue with the rest of your code as is...


// Create and add a water body to the scene
const waterGeometry = new THREE.PlaneGeometry(100, 100);
const water = new Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 1024,
    textureHeight: 1024,
});
water.position.y = -3;
water.rotation.x = Math.PI * -0.5;
scene.add(water);

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

loadGLTFModel("models/low_poly_tree_scene_free/scene.gltf", 2, { x: 0, y: 0, z: 0 });


// Initiate the lighting update and start the animation loop
updateLighting(settings.timeOfDay);

function addBonfire(position, scale) {
    const bonfire = new THREE.Group();

    // Logs setup
    const logMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const logGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
    for (let i = 0; i < 3; i++) {
        const log = new THREE.Mesh(logGeometry, logMaterial);
        log.rotation.z = (i / 3) * Math.PI * 2;
        log.position.y = 0.25;
        bonfire.add(log);
    }

    bonfire.rotation.x = -Math.PI / 2


    // Fire light setup
    const fireLight = new THREE.PointLight(0xff4500, 5, 100);
    fireLight.position.set(position.x, position.y + 2, position.z);
    // bonfire.add(fireLight);

    // Flames setup
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.75 });
    const flameGeometry = new THREE.ConeGeometry(1, 3, 32);
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 2;
    // bonfire.add(flame);

    // Group scaling and positioning
    bonfire.scale.set(scale, scale, scale);
    bonfire.position.set(position.x, position.y, position.z);

    scene.add(flame);
    scene.add(fireLight);

    scene.add(bonfire);
    return fireLight;  // Important: Return the light object
}

var textureLoader = new THREE.TextureLoader();
var tex = textureLoader.load("Fire.png");
var fire = new THREE.Fire( tex );

scene.add( fire );
// Declare fireLight at a broader scope
let fireLight;

// Set up the bonfire
fireLight = addBonfire({ x: 0, y: 0, z: 0 }, 1.5);

export function animate() {
    requestAnimationFrame(animate);

    // Check if fireLight is defined before accessing its properties
    if (fireLight) {
        fireLight.intensity = 5 + Math.random() * 100;  // Flickering effect
    }
    // fire.update(performance.now() / 1000);

    // Movement and control logic
    if (controls.isLocked === true) {
        const delta = 0.01;
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
