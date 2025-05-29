
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
    
    // Animation setup
    const mixer = new THREE.AnimationMixer(group);

    // === Idle Animation ===
    const idleTimes = [0, 1, 2];
    const idleValues = [
        0, 0.3, 0,
        0, 0.32, 0,
        0, 0.3, 0
    ];
    const idleTrack = new THREE.VectorKeyframeTrack('.children[0].position', idleTimes, idleValues);
    const idleClip = new THREE.AnimationClip('idle', -1, [idleTrack]);
    const idleAction = mixer.clipAction(idleClip);
    idleAction.play();

    // === Death Animation ===
    const deathDuration = 1;
    const spinTrack = new THREE.NumberKeyframeTrack('.rotation[y]', [0, deathDuration], [0, Math.PI * 4]);
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', [0, deathDuration], [1, 1, 1, 0, 0, 0]);
    const deathClip = new THREE.AnimationClip('death', deathDuration, [spinTrack, scaleTrack]);
    const deathAction = mixer.clipAction(deathClip);
    deathAction.setLoop(THREE.LoopOnce);
    deathAction.clampWhenFinished = true;

    return { group, mixer, idleAction, deathAction };
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
    const windowColor = 0x111111;

    // Corpo principal
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 1.2, 1.2),
        new THREE.MeshStandardMaterial({ color: bodyColor })
    );
    body.position.set(0, 1, 0);
    group.add(body);

    // Frontal
    let hood = new THREE.Group();
    const hoodGeometry = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.5, 1.2),
        new THREE.MeshStandardMaterial({ color: bodyColor })
    );
    hood.add(hoodGeometry);

    // Headlights
    const headlightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight1.position.set(2.1, 0.5, 0.4);

    const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight2.position.set(2.1, 0.5, -0.4);


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
    hood.add(headlight1, headlight2);

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

    
    group.add(headlight1, headlight2);

    return group;
}

export function createLog() {
    const logGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // Carregar textura de madeira
    const woodTexture = textureLoader.load('textures/wood_log.jpg');

    // Repetição opcional da textura para alongar a imagem
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(2, 1);

    // Material com textura
    const material = new THREE.MeshStandardMaterial({ map: woodTexture });

    // Tronco principal
    const mainGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const mainLog = new THREE.Mesh(mainGeometry, material);
    mainLog.rotation.z = Math.PI / 2;
    logGroup.add(mainLog);

    // Função para criar ramos
    function createBranch(position, rotation) {
        const branchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
        const branch = new THREE.Mesh(branchGeometry, material);
        branch.position.set(position.x, position.y, position.z);
        branch.rotation.set(rotation.x, rotation.y, rotation.z);
        logGroup.add(branch);
    }

    // Adicionar ramos
    createBranch(new THREE.Vector3(0.5, 0.3, 0), new THREE.Euler(0, 0, Math.PI / 4));
    createBranch(new THREE.Vector3(-0.8, -0.2, 0), new THREE.Euler(0, 0, -Math.PI / 4));
    createBranch(new THREE.Vector3(0, 0, 0.5), new THREE.Euler(Math.PI / 4, 0, 0));

    return logGroup;
}


export function createWater() {
    const geometry = new THREE.PlaneGeometry(100, 9);
    const material = new THREE.MeshStandardMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.5 });
    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2; // Roda o plano para ficar na horizontal
    water.position.y = 0.1; // Eleva o plano um pouco acima do chão
    return water;
}

export function createExplosion(position, scene) {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        // Start at origin (will be positioned later)
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Random velocity for each particle
        velocities.push(new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            Math.random() * 2,
            (Math.random() - 0.5) * 2
        ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffaa00,
        size: 0.1
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    scene.add(particles);

    // Animate particles
    const startTime = performance.now();
    function updateParticles() {
        const elapsed = (performance.now() - startTime) / 1000;

        const pos = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const v = velocities[i];
            pos[i * 3] += v.x * 0.02;
            pos[i * 3 + 1] += v.y * 0.02 - elapsed * 0.02; // gravity
            pos[i * 3 + 2] += v.z * 0.02;
        }
        geometry.attributes.position.needsUpdate = true;

        if (elapsed < 2) {
            requestAnimationFrame(updateParticles);
        } else {
            scene.remove(particles);
        }
    }

    updateParticles();
}

