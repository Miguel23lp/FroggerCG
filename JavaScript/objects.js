export function createFrog() {
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 0.6, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Verde mais "realista"
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.3, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 0.5, -0.6);
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    for (let i of [-0.2, 0.2]) {
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eye.position.set(i, 0.7, -0.8);
        eye.castShadow = true;
        eye.receiveShadow = true;
        group.add(eye);

        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), pupilMaterial);
        pupil.position.set(i, 0.7, -0.85);
        pupil.castShadow = true;
        pupil.receiveShadow = true;
        group.add(pupil);
    }

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
    for (let i of [-0.4, 0.4]) {
        const leg = new THREE.Mesh(legGeometry, bodyMaterial);
        leg.position.set(i, 0.15, 0.5);
        leg.castShadow = true;
        leg.receiveShadow = true;
        group.add(leg);
    }

    // feet
    const footGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.4);
    for (let i of [-0.3, 0.3]) {
        const foot = new THREE.Mesh(footGeometry, bodyMaterial);
        foot.position.set(i, 0.05, -0.7);
        foot.castShadow = true;
        foot.receiveShadow = true;
        group.add(foot);
    }

    return group;
}

export function createCar() {
    const group = new THREE.Group();
    const colors = [0xff0000, 0x0000ff, 0x00ff00];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: chosenColor });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0.25, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Roof
    const roofGeometry = new THREE.BoxGeometry(1, 0.4, 0.8);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 0.55, 0);
    roof.castShadow = true;
    roof.receiveShadow = true;
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
            wheel.castShadow = true;
            wheel.receiveShadow = true;
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
    

    const headlightSpotLight1 = new THREE.SpotLight(0xffff00, 3, 7, Math.PI / 5, 0.7, 1);
    headlight1.add(headlightSpotLight1);
    headlight1.add(headlightSpotLight1.target);
    headlightSpotLight1.position.set(0, 0, 0);
    headlightSpotLight1.target.position.set(1, -0.3, 0);
    //headlightSpotLight1.castShadow = true;
    
    const headlightSpotLight2 = new THREE.SpotLight(0xffff00, 3, 7, Math.PI / 5, 0.7, 1);
    headlight2.add(headlightSpotLight2);
    headlight2.add(headlightSpotLight2.target);
    headlightSpotLight2.position.set(0, 0, 0);
    headlightSpotLight2.target.position.set(1, -0.3, 0);
    //headlightSpotLight2.castShadow = true;

    //headlight1.receiveShadow = true;
    //headlight2.receiveShadow = true;
    group.add(headlight1, headlight2);

    return group;
}

export function createVan() {
    const group = new THREE.Group();
    
    const bodyColor = 0xcccccc;
    const bumperColor = 0x333333;
    const windowColor = 0x111111;

    // Corpo principal
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.6, 1.2),
        new THREE.MeshStandardMaterial({ color: bodyColor })
    );
    body.position.set(0, 0.8, 0);
    group.add(body);

    // Frontal
    const hood = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.5, 1.2),
        new THREE.MeshStandardMaterial({ color: bodyColor })
    );
    hood.position.set(1.6, 0.55, 0);
    hood.rotation.x = -0.08;
    group.add(hood);    

    // Vidro dianteiro
    const frontWindow = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.5, 1.1),
        new THREE.MeshStandardMaterial({ color: windowColor })
    );
    frontWindow.position.set(1.2, 1.2, 0);
    group.add(frontWindow);

    // Retrovisores
    const mirrorGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.15);
    const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const mirrorLeft = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirrorLeft.position.set(1.0, 1.1, 0.75);
    const mirrorRight = mirrorLeft.clone();
    mirrorRight.position.z = -0.75;
    group.add(mirrorLeft, mirrorRight);

    const wheelPositions = [
        [-1.1, 0.25, 0.6], [-1.1, 0.25, -0.6],
        [1.1, 0.25, 0.6], [1.1, 0.25, -0.6],
    ];

    wheelPositions.forEach(([x, y, z]) => {
    const wheelGroup = new THREE.Group();

    const tire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    tire.rotation.x = Math.PI / 2;
    wheelGroup.add(tire);

    wheelGroup.position.set(x, y, z);
    group.add(wheelGroup);
    });

    return group;
}

export function createLog() {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const log = new THREE.Mesh(geometry, material);
    log.rotation.z = Math.PI / 2; // Roda o tronco para ficar na horizontal
    return log;
}

export function createWater() {
    const geometry = new THREE.PlaneGeometry(100, 9);
    const material = new THREE.MeshStandardMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.5 });
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2; // Roda o plano para ficar na horizontal
    water.position.y = 0.1; // Eleva o plano um pouco acima do chão
    return water;
}


