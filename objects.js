import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water2.js';
import { scene, camera, renderer, controls, params, moveForward, moveBackward, moveLeft, moveRight, velocity } from './sceneSetup.js';
import { Fire } from './Fire.js';

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

    
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load('textures/firewood.jpg'); // Replace with the actual path to your texture image

    const logMaterial = new THREE.MeshLambertMaterial({ map: woodTexture });

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



export function createStars() {
    // Create star visuals
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        sizeAttenuation: true,
        // map: new THREE.TextureLoader().load('star.png'), // Use a texture for stars
        alphaTest: 0.5,
        transparent: true
    });

    const starVertices = [];
    const numStars = 10000; // Adjust the number of stars for performance

    for (let i = 0; i < numStars; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5)*50+100;
        const z = (Math.random() - 0.5) * 1000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

export function setupFire(scene) {
    var textureLoader = new THREE.TextureLoader();
    var tex = textureLoader.load("textures/Fire.png");

    var fire = new Fire(tex);
    fire.position.set(10, 1, 30);
    fire.scale.set(5, 5, 5);
    fire.material.uniforms.magnitude.value = 2.0; 

    return fire;
}

export function setupMoon(scene) {
    // Load the moon texture
    const moonTextureLoader = new THREE.TextureLoader();
    const moonTexture = moonTextureLoader.load('textures/moon_texture.png'); // Replace with the path to your moon texture

    // Create a sphere geometry for the moon
    const moonGeometry = new THREE.SphereGeometry(10, 32, 32);
    const moonMaterial = new THREE.MeshLambertMaterial({
        map: moonTexture,          // Apply the texture to the moon
        color: 0xffffff,           // Set the color of the moon
        emissive: 0xffffff,        // Add some emissive light to the moon
        emissiveIntensity: 0.04    // Adjust the intensity of the emissive light
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(-200, 200, -200); // Position the moon in the sky
    scene.add(moon);

    // Create a halo effect around the moon
    const haloGeometry = new THREE.SphereGeometry(11, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.copy(moon.position);
    scene.add(halo);

    // Add a point light to simulate moonlight
    const moonLight = new THREE.PointLight(0xffffff, 5000, 5000);
    moonLight.position.set(-200, 200, -200); // Position the light at the same place as the moon
    scene.add(moonLight);

    // Add a spotlight to shine on the moon
    const spotLight = new THREE.SpotLight(0xffffff, 50000);
    spotLight.position.set(-100, 100, -100); // Adjust this position as needed
    spotLight.target = moon; // Point the spotlight at the moon
    spotLight.castShadow = true;
    scene.add(spotLight);
}