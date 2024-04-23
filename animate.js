import * as THREE from 'three';
import { scene, controls, camera, renderer, moveForward, moveBackward, moveLeft, moveRight, velocity, params } from './sceneSetup.js';

// import { water } from "./main.js";

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// const gui = new GUI();



// gui.addColor( params, 'color' ).onChange( function ( value ) {
//     water.material.uniforms[ 'color' ].value.set( value );
// } );
// gui.add( params, 'scale', 1, 10 ).onChange( function ( value ) {
//     water.material.uniforms[ 'config' ].value.w = value;
// } );
// gui.add( params, 'flowX', - 1, 1 ).step( 0.01 ).onChange( function ( value ) {
//     water.material.uniforms[ 'flowDirection' ].value.x = value;
//     water.material.uniforms[ 'flowDirection' ].value.normalize();
// } );
// gui.add( params, 'flowY', - 1, 1 ).step( 0.01 ).onChange( function ( value ) {
//     water.material.uniforms[ 'flowDirection' ].value.y = value;
//     water.material.uniforms[ 'flowDirection' ].value.normalize();
// });

// gui.open();

// Animation loop



export function animate () {
    
    
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        var delta = 0.1;
        velocity.x -= velocity.x * 1.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;

        if (moveForward) velocity.z -= 5.0 * delta;
        if (moveBackward) velocity.z += 5.0 * delta;
        if (moveLeft) velocity.x += 5.0 * delta;
        if (moveRight) velocity.x -= 5.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }
    
    // const delta_time = clock.getDelta();

    // torusKnot.rotation.x += delta_time;
    // torusKnot.rotation.y += delta_time * 0.5;




    renderer.render(scene, camera);
};