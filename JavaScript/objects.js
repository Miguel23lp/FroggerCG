import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export function createFrog() {
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 0.6, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Verde mais "realista"
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.3, 0);
    group.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 0.5, -0.6);
    group.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    for (let i of [-0.2, 0.2]) {
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(i, 0.7, -0.8);
        group.add(eye);

        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), pupilMaterial);
        pupil.position.set(i, 0.7, -0.85);
        group.add(pupil);
    }

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
    for (let i of [-0.4, 0.4]) {
        const leg = new THREE.Mesh(legGeometry, bodyMaterial);
        leg.position.set(i, 0.15, 0.5);
        group.add(leg);
    }

    // feet
    const footGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.4);
    for (let i of [-0.3, 0.3]) {
        const foot = new THREE.Mesh(footGeometry, bodyMaterial);
        foot.position.set(i, 0.05, -0.7);
        group.add(foot);
    }

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

