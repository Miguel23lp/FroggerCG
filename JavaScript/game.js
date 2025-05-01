import { createFrog, createCar, createLog } from './objects.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export function initGame(scene, camera) {
    const frog = createFrog();
    scene.add(frog);
    camera.position.set(0, 10, 10);
    camera.lookAt(frog.position);

    const cars = [];
    for (let i = 0; i < 5; i++) {
        const car = createCar();
        car.position.set(i * 4 - 8, 0.5, -2);
        scene.add(car);
        cars.push(car);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            frog.position.z -= 1;
            frog.lookAt(frog.position, frog.position+new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0));
        }
        if (event.key === 'ArrowDown') {
            frog.position.z += 1;
            frog.lookAt(frog.position, frog.position+new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0));
        }
        if (event.key === 'ArrowLeft') {
            frog.position.x -= 1;
            frog.lookAt(frog.position, frog.position+new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0));
        }
        if (event.key === 'ArrowRight') {
            frog.position.x += 1;
            frog.lookAt(frog.position, frog.position+new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0));
        }
    });
}
