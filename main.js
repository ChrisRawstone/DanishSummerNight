import * as THREE from 'three';
import { GLTFLoader } from './build/loaders/GLTFLoader.js';
import { PointerLockControls } from './build/controls/PointerLockControls.js';
import { scene, camera, renderer, controls, velocity, moveBackward, moveForward, moveRight, moveLeft, params} from './sceneSetup.js';
import { animate } from './animate.js';
import { Water } from 'three/addons/objects/Water2.js';






const groundGeometry = new THREE.PlaneGeometry( 20, 20 );
const groundMaterial = new THREE.MeshStandardMaterial( { roughness: 0.8, metalness: 0.4 } );
const ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.rotation.x = Math.PI * - 0.5;
scene.add( ground );

const textureLoader = new THREE.TextureLoader();
textureLoader.load( 'textures/hardwood2_diffuse.jpg', function ( map ) {

    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.repeat.set( 4, 4 );
    map.colorSpace = THREE.SRGBColorSpace;
    groundMaterial.map = map;
    groundMaterial.needsUpdate = true;

} );


const waterGeometry = new THREE.PlaneGeometry( 20, 20 );
export var water = new Water( waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
    textureWidth: 1024,
    textureHeight: 1024,

} );
water.position.y = 1;
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









animate();
