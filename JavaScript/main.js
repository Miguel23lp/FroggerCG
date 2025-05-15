import { initGame, gameLoop } from './game.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(0.3); // diminui a resolução para 50%

// Enable shadow map on renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
console.log(directionalLight.target);
// Enable shadows on directional light
directionalLight.castShadow = true;

// Optional: configure shadow map size and camera for better quality
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

scene.add(directionalLight);

// Allows to visualize the direction of the light
//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
//scene.add(directionalLightHelper);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x5c5c5c });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Initialize the game
initGame(scene, camera);


const targetFPS = 30;
const interval = 1000 / targetFPS; // em milissegundos (1000 ms / 30 fps = 33.33 ms)

let then = performance.now();

function animate(now) {
    requestAnimationFrame(animate);
    const delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval); // corrige o tempo acumulado
        gameLoop();
        renderer.render(scene, camera);
    }
}
animate(0);
