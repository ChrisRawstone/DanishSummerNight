import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { MTLLoader } from '../build/loaders/MTLLoader.js';
import { OBJLoader } from '../build/loaders/OBJLoader.js';



 //create the scene
var scene = new THREE.Scene( );
var ratio = window.innerWidth/window.innerHeight;
//create the perspective camera
//for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
var camera = new THREE.PerspectiveCamera(45,ratio,0.1,1000);


// best camera position
// 2.51,22.18,87.64

// best camera direction
// 2.48, 21.93, 86.67

//set the camera position
camera.position.set(2.51,22.18,87.64);
// and the direction
camera.lookAt(2.48, 21.93, 86.67);

//create the webgl renderer
var renderer = new THREE.WebGLRenderer( );

//set the size of the rendering window
renderer.setSize(window.innerWidth,window.innerHeight);

//add the renderer to the current document
document.body.appendChild(renderer.domElement );

// add the new control and link to the current camera to transform its position

var controls = new OrbitControls( camera, renderer.domElement );

// Create the plane geometry
var floorGeometry = new THREE.PlaneGeometry(100, 100); // Size of the floor
var floorMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 }); // Green color
var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

// Rotate the floor to be horizontal
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = -0.5; // Slightly lower it to act as the ground level

// Add the floor to the scene
scene.add(floorMesh);

// Ensure that the light affects the floor as well
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a directional light to create shadows and depth
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 10, 5);
scene.add(directionalLight);

// Function to log camera settings
function logCameraSettings() {
    console.log('Camera Position:', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2));
    var lookAtVector = new THREE.Vector3(0, 0, -1);
    lookAtVector.applyQuaternion(camera.quaternion);
    lookAtVector.add(camera.position);
    console.log('Camera LookAt:', lookAtVector.x.toFixed(2), lookAtVector.y.toFixed(2), lookAtVector.z.toFixed(2));
}

// Add this line inside your MyUpdateLoop or as a separate listener if using OrbitControls
controls.addEventListener('change', logCameraSettings);

// Optionally, you can call this function once initially to log the starting position and direction
logCameraSettings();


//then add lighting
var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 1 );
camera.add( cameralight );
scene.add(camera);

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

var mtlload=new MTLLoader();
mtlload.setPath( 'models/' )
mtlload.load( 'tree_house/tree_house.mtl', function ( materials ) 
{
materials.preload();
var objload=new OBJLoader();
objload.setMaterials( materials )
objload.setPath( 'models/' )
objload.load( 'tree_house/tree_house.obj', function ( object ) 
{
    var box3 = new THREE.Box3();
    box3.setFromObject (object);
    var CenterBB= new THREE.Vector3();
    var SizeBB = new THREE.Vector3();
    box3.getCenter(CenterBB);
    box3.getSize(SizeBB);
    for ( var i = 0, l = object.children.length; i < l; i ++ ) 
    {
        object.children[i].material.color= new THREE.Color(1,1,1);
     }
    
    // var sca = new THREE.Matrix4();
    // var tra = new THREE.Matrix4();
    // var combined = new THREE.Matrix4();

    // sca.makeScale(20/SizeBB.length(),20/SizeBB.length(),20/SizeBB.length());
    // tra.makeTranslation (-CenterBB.x,-CenterBB.y,-CenterBB.z);
    // combined.multiply(sca);
    // combined.multiply(tra);

    //   object.applyMatrix4(combined);
    scene.add( object );

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
