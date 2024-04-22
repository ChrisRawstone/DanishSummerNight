import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { MTLLoader } from '../build/loaders/MTLLoader.js';
import { OBJLoader } from '../build/loaders/OBJLoader.js';
import { GLTFLoader } from '../build/loaders/GLTFLoader.js';

 //create the scene
var scene = new THREE.Scene( );
var ratio = window.innerWidth/window.innerHeight;
//create the perspective camera
//for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
var camera = new THREE.PerspectiveCamera(45,ratio,0.1,1000);

//set the camera position
camera.position.set(2.51,22.18,87.64);
// and the direction
camera.lookAt(2.48, 21.93, 86.67);



// Enable shadows in the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows
document.body.appendChild(renderer.domElement);


// add the new control and link to the current camera to transform its position

var controls = new OrbitControls( camera, renderer.domElement );

// Load the floor texture
var jungle_groundtexture = new THREE.TextureLoader().load('textures/jungleground_texture.jpeg', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(25, 25);  // Adjust the number to your preference for texture repetition
});

// Create the material with the texture
var floorMaterial = new THREE.MeshLambertMaterial({ map: jungle_groundtexture });

// Create the floor mesh with the geometry and the textured material
var floorGeometry = new THREE.PlaneGeometry(500, 500); // Size of the floor
var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

// Continue with your transformations and scene setup
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = -0.5; // Position it to act as the ground level
scene.add(floorMesh);

// Ensure that the light affects the floor as well
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// Create a directional light from above
var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Bright white light
directionalLight.position.set(0, 50, 0); // Position above the scene

// Enable shadow casting by the light
directionalLight.castShadow = true;

// Set shadow properties for better performance and quality
directionalLight.shadow.mapSize.width = 2048; // Increase for better shadow resolution
directionalLight.shadow.mapSize.height = 2048; // Increase for better shadow resolution
directionalLight.shadow.camera.near = 0.5; // Closer near clipping plane can help with precision
directionalLight.shadow.camera.far = 100; // Far clipping plane
directionalLight.shadow.camera.left = -50; // Increase or decrease these bounds to cover your scene
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;

// Add the light to the scene
scene.add(directionalLight);

// Optional: Add a helper to visualize the light's coverage (useful for debugging)
var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);


// Assuming 'floorMesh' and 'object' are your floor and building/tree meshes respectively
floorMesh.receiveShadow = true; // Floor should receive shadows

// For each mesh that represents trees or buildings, enable casting and receiving shadows
floorMesh.traverse(function(child) {
    if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
    }
});




// Set a light blue sky background
scene.background = new THREE.Color(0x87CEEB); // Light blue, similar to sky blue

// Existing code below...


//final update loop
var MyUpdateLoop = function ( )
{
//call the render with the scene and the camera
renderer.render(scene,camera);

controls.update();

//finally perform a recoursive call to update again
//this must be called because the mouse change the camera position
requestAnimationFrame(MyUpdateLoop);
};

requestAnimationFrame(MyUpdateLoop);


const gltfLoader = new GLTFLoader();
gltfLoader.load('models/oak_trees/scene.gltf', (gltfScene) => {
    // Traverse every child and enable shadows
    gltfScene.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    gltfScene.scene.scale.set(20, 20, 20)
    gltfScene.scene.position.z = -30; // Move the tree 10 units to the right
    scene.add(gltfScene.scene);
});

gltfLoader.load('models/jungle_tree/scene.gltf', (gltfScene) => {
    gltfScene.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    gltfScene.scene.scale.set(1, 1, 1)
    gltfScene.scene.position.z = -30;
    gltfScene.scene.position.x = 25; 
    scene.add(gltfScene.scene);

});


gltfLoader.load('models/realistic_jungle_tree_avatar/scene.gltf', (gltfScene) => {
    // Traverse every child and enable shadows
    gltfScene.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    gltfScene.scene.scale.set(0.5, 0.5, 0.5)
    gltfScene.scene.position.z = 0; // Move the tree 10 units to the right
    scene.add(gltfScene.scene);
});




var mtlload=new MTLLoader();
var objload=new OBJLoader();
mtlload.setPath( 'models/' )


mtlload.load( 'tree_house/tree_house.mtl', function ( materials )  {
materials.preload();
objload.setMaterials( materials )
objload.setPath( 'models/' )
objload.load( 'tree_house/tree_house.obj', function ( object ) 
{
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(object);


    });
} );

//this fucntion is called when the window is resized
var MyResize = function ( )
{
var width = window.innerWidth;
var height = window.innerHeight;
renderer.setSize(width,height);
camera.aspect = width/height;
camera.updateProjectionMatrix();
renderer.render(scene,camera);
};

//link the resize of the window to the update of the camera
window.addEventListener( 'resize', MyResize);
