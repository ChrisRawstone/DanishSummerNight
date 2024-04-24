import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water2.js';
import { scene, camera, renderer, controls, params, moveForward, moveBackward, moveLeft, moveRight, velocity } from './sceneSetup.js';


class Firefly {
    constructor(scene) {
        this.scene = scene;
        this.firefly = new THREE.Group();
        const light = new THREE.PointLight(0xffff00, 20, 50);
        this.firefly.add(light);
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);
        this.firefly.add(sphere);
        this.firefly.position.set(
            (Math.random() * 10) - 5, 
            (Math.random() * 10) + 5,   
            (Math.random() * 10) - 5  
        );
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 20
        );
        scene.add(this.firefly);
    }

    move(delta) {
        this.firefly.position.addScaledVector(this.velocity, delta);
        if (this.firefly.position.x <= -20 || this.firefly.position.x >= 20) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.firefly.position.y <= 0 || this.firefly.position.y >= 10) {
            this.velocity.y = -this.velocity.y;
        }
        if (this.firefly.position.z <= -20 || this.firefly.position.z >= 20) {
            this.velocity.z = -this.velocity.z;
        }
        this.velocity.add(new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 2
        ));
    }
}

export function createFireflies(scene, count) {
    const fireflies = [];
    for (let i = 0; i < count; i++) {
        fireflies.push(new Firefly(scene));
    }
    return fireflies;
}



export function addBonfire(position, scale) {
    const bonfire = new THREE.Group();

    const logMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const logGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
    for (let i = 0; i < 3; i++) {
        const log = new THREE.Mesh(logGeometry, logMaterial);
        log.rotation.z = (i / 3) * Math.PI * 2;
        log.position.y = 0.25;
        log.rotation.x = -Math.PI / 2;
        bonfire.add(log);
    }

    const fireLight = new THREE.PointLight(0xff4500, 5, 100);
    fireLight.position.set(0, 2, 0);
    bonfire.add(fireLight);

    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.75 });
    const flameGeometry = new THREE.ConeGeometry(1, 2, 32);
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);

    flame.position.y = 1;
    bonfire.add(flame);

    bonfire.scale.set(scale, scale, scale);
    bonfire.position.set(position.x, position.y, position.z);

    return { bonfire, fireLight };
}

// Create and add a water body to the scene
const waterGeometry = new THREE.PlaneGeometry(100, 100);
export var water = new Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 1024,
    textureHeight: 1024,
});
water.position.y = -3;
water.rotation.x = Math.PI * -0.5;



// Continue with the rest of your code as is...
class CustomStraightCurve extends THREE.Curve {
    constructor( scale = 1 ) {
        super();
        this.scale = scale;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {
        // Create a straight line along the x-axis
        const tx = t * 3 - 1.5;  // This determines the length and position along x-axis
        const ty = 0;            // Constant y-coordinate
        const tz = 0;            // Constant z-coordinate

        return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
    }
}

// Use the new class for creating a straight tube
const path = new CustomStraightCurve( 10 );
const geometry = new THREE.TubeGeometry( path, 10, 50, 80, false );
const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide // Render both sides of the material
});
material.color=  new THREE.Color(1,1,1);

var stone_texture = new THREE.TextureLoader().load('texture/jungleground_texture.jpeg');
material.map= stone_texture;

export const tube = new THREE.Mesh( geometry, material );

tube.rotation.z = -Math.PI / 2