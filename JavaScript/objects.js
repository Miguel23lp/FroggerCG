export function createFrog() {
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 0.6, 1);

    const textureLoader = new THREE.TextureLoader();
    const frogTexture = textureLoader.load('textures/frog.jpg');

    const bodyMaterial = new THREE.MeshStandardMaterial({ map: frogTexture });


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

    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
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
    const textureLoader = new THREE.TextureLoader();
    const riverTexture = textureLoader.load('textures/river.jpg'); // ajusta o caminho se necessário

    // Faz com que a textura se repita ao longo do plano
    riverTexture.wrapS = THREE.RepeatWrapping;
    riverTexture.wrapT = THREE.RepeatWrapping;
    riverTexture.repeat.set(5, 1); // aumenta horizontalmente (x) se quiseres mais repetições

    const geometry = new THREE.PlaneGeometry(100, 9);
    const material = new THREE.MeshStandardMaterial({
        map: riverTexture,
        transparent: true,
        opacity: 0.9,
    });

    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.1;
    water.receiveShadow = true;

    return water;
}
export function createRoadLane(z) {
    const textureLoader = new THREE.TextureLoader();
    const roadTexture = textureLoader.load('textures/road.jpg');

    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 5); // se precisares de repetir no novo eixo
    roadTexture.center.set(0.5, 0.5);    // centro da textura
    roadTexture.rotation = Math.PI / 2;  // 90 graus

    const geometry = new THREE.PlaneGeometry(100, 2);
    const material = new THREE.MeshStandardMaterial({ map: roadTexture });

    const road = new THREE.Mesh(geometry, material);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.101, z);
    road.receiveShadow = true;

    return road;
}
