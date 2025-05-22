import { initGame, gameLoop, verificarColisoes, setObstacleSpeedMultiplier, setGlobalVolume } from './game.js';

let scene, camera, renderer;
let then = performance.now();

let backgroundMusic;

let volume = 0.5; // volume inicial padrão
let difficultyMultiplier = 1;


const targetFPS = 30;
const interval = 1000 / targetFPS; // em ms

function iniciarJogo() {
    // CENA e RENDERER
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // LUZES
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x5c5c5c });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // INICIAR JOGO
    initGame(scene, camera);

    // COMEÇAR ANIMAÇÃO
    animate(0);
}

function animate(now) {
    requestAnimationFrame(animate);
    const delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
        gameLoop(scene, camera);
        renderer.render(scene, camera);
    }
}

// MENU INICIAL
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const menu = document.getElementById('menu');
    const lives = document.getElementById('lives');
    const increaseDifficultyBtn = document.getElementById('increaseDifficultyBtn');
    const volumeControl = document.getElementById('volumeControl');

    const clickSound = new Audio('sounds/click.wav');

    startBtn.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();

        menu.style.display = 'none';
        lives.style.display = 'block';

        iniciarJogo();

        backgroundMusic = new Audio('sounds/music.wav');
        backgroundMusic.loop = true;
        backgroundMusic.volume = parseFloat(volumeControl.value) || 0.4;
        backgroundMusic.play();
    });

    increaseDifficultyBtn.addEventListener('click', () => {
        difficultyMultiplier *= 1.5;
        setObstacleSpeedMultiplier(difficultyMultiplier);
        increaseDifficultyBtn.textContent = `Dificuldade x${difficultyMultiplier.toFixed(2)}`;
    });

    volumeControl.addEventListener('input', (e) => {
        const volume = parseFloat(e.target.value);
        setGlobalVolume(volume);

        if (backgroundMusic) {
            backgroundMusic.volume = volume;
        }
    });
});