import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export function createFrog() {
    const group = new THREE.Group();
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.5, 0);
    group.add(body);
    // Head
    const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1.25, -0.25);
    group.add(head);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-0.6, 0.1, -0.25);
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(0.6, 0.1, -0.25);
    group.add(leg1, leg2);


    return group;
}

export function createCar() {
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.25, 0);
    group.add(body);

    // Roof
    const roofGeometry = new THREE.BoxGeometry(1, 0.4, 0.8);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 0.55, 0);
    group.add(roof);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.rotation.y = Math.PI / 2;
            wheel.position.set(i * 0.8, 0.1, j * 0.4);
            group.add(wheel);
        }
    }
    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight1.position.set(1, 0.3, 0.4);
    const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight2.position.set(1, 0.3, -0.4);


    group.add(headlight1, headlight2);

    return group;
}

export function createLog() {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const log = new THREE.Mesh(geometry, material);
    return log;
}

