import * as THREE from "three";
import { initGame, gameLoop, setGlobalVolume } from './game.js';
import { createRoad } from './objects.js';

let then = performance.now();

let backgroundMusic;

let volume = 0.5; // volume inicial padrão

let ambientLight;
let directionalLight;
let ambientOn = true;
let directionalOn = true;

let scene, camera, renderer;
let perspectiveCamera, orthographicCamera;
let usingPerspective = true;

const targetFPS = 30;
const interval = 1000 / targetFPS; // em ms

function iniciarJogo() {
    // CENA e RENDERER
    scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const zoomOut = 15; // Aumenta este valor se ainda vires pouco

    // Câmara em perspetiva
    perspectiveCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    perspectiveCamera.position.set(0, 6, 12);
    perspectiveCamera.lookAt(0, -5, 0);

// Câmara ortográfica
    orthographicCamera = new THREE.OrthographicCamera(
        -aspect * zoomOut,  // esquerda
         aspect * zoomOut,  // direita
         zoomOut,           // topo
        -zoomOut,           // fundo
        0.1,
        1000
    );
    orthographicCamera.position.set(0, 6, 12);
    orthographicCamera.lookAt(0, -5, 0);

// Começa com a câmara em perspetiva
    camera = perspectiveCamera;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '0';

    // LUZES
    ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // CHÃO
    /*
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x5c5c5c });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    */

    let road1 = createRoad();
    let road2 = createRoad();
    road1.position.setZ(6);
    road2.position.setZ(2);
    scene.add(road1);
    scene.add(road2);

    // INICIAR JOGO
    initGame(scene, camera);

    // COMEÇAR ANIMAÇÃO
    animate(0);
}

function animate(now) {
    requestAnimationFrame(animate);
    const delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval); // corrige o tempo acumulado
        gameLoop(delta);
        renderer.render(scene, camera);
    }
}

// MENU INICIAL
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const menu = document.getElementById('menu');
    const volumeControl = document.getElementById('volumeControl');

    const toggleAmbientBtn = document.getElementById('toggleAmbientBtn');
    const toggleDirectionalBtn = document.getElementById('toggleDirectionalBtn');

    toggleAmbientBtn.addEventListener('click', () => {
        ambientOn = !ambientOn;
        if (ambientLight) ambientLight.visible = ambientOn;
        toggleAmbientBtn.textContent = ambientOn ? "💡 Luz Ambiente Ligada" : "🌑 Luz Ambiente Desligada";
    });

    toggleDirectionalBtn.addEventListener('click', () => {
        directionalOn = !directionalOn;
        if (directionalLight) directionalLight.visible = directionalOn;
        toggleDirectionalBtn.textContent = directionalOn ? "🔦 Luz Direcional Ligada" : "🌑 Luz Direcional Desligada";
    });

    const toggleCameraBtn = document.getElementById('toggleCameraBtn');
        toggleCameraBtn.addEventListener('click', () => {
        usingPerspective = !usingPerspective;
        camera = usingPerspective ? perspectiveCamera : orthographicCamera;
        toggleCameraBtn.textContent = usingPerspective ? "📷 Perspetiva" : "📐 Ortográfica";
    });



    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;
            renderer.setSize(window.innerWidth, window.innerHeight);

    // Atualizar câmara perspetiva
            perspectiveCamera.aspect = aspect;
            perspectiveCamera.updateProjectionMatrix();

    // Atualizar câmara ortográfica
        const zoomOut = 15;
            orthographicCamera.left = -aspect * zoomOut;
            orthographicCamera.right = aspect * zoomOut;
            orthographicCamera.top = zoomOut;
            orthographicCamera.bottom = -zoomOut;
            orthographicCamera.updateProjectionMatrix();
    });


    const clickSound = new Audio('sounds/click.wav');

    startBtn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();

        menu.style.display = 'none';

        iniciarJogo();

        backgroundMusic = new Audio('sounds/music.wav');
        backgroundMusic.loop = true;
        backgroundMusic.volume = parseFloat(volumeControl.value) || 0.4;
        backgroundMusic.play();
    });


    volumeControl.addEventListener('input', (e) => {
        const volume = parseFloat(e.target.value);
        setGlobalVolume(volume);

        if (backgroundMusic) {
            backgroundMusic.volume = volume;
        }
    });


    startBtn.click(); // APAGAR
});