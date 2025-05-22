import { createFrog, createCar, createLog, createWater } from './objects.js';


let lanes = [];
let vidas = 3;
let frog;      // variável global do sapo
let jumping;   // variável global do estado do salto
//Audio do jogo

const jumpSound = new Audio('./sounds/jump.wav');
const winSound = new Audio('./sounds/win.wav');
const loseSound = new Audio('./sounds/lose.wav');
const checkpointSound = new Audio('./sounds/checkpoint.wav');

let checkpoints = [];
let score = 0;
let checkpointsVisitados = new Set();

let obstacleSpeedMultiplier = 1;
let globalVolume = 0.5;

export function initGame(scene, camera) {
    frog = createFrog();
    frog.position.set(0, 0, 11);
    scene.add(frog);

    camera.position.set(0, 6, 12);
    camera.lookAt(0, -5, 0);

    jumping = false;

    const water = createWater();
    water.position.set(0, 0.1, -4.5);
    scene.add(water);

    // Criar os 3 checkpoints (após o rio)
    checkpoints = [];

    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BoxGeometry(2, 0.2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const checkpoint = new THREE.Mesh(geometry, material);
        checkpoint.position.set(-4 + i * 4, 0.1, -9);
        checkpoint.receiveShadow = true;

        checkpoints.push(checkpoint);
        scene.add(checkpoint);
    }

    lanes = [];

    // Criar faixas de carros
    for (let i = 0; i < 4; i++) {
        let z = 1 + i * 2;
        lanes.push({
            z,
            type: 'car',
            direction: i % 2 === 0 ? 1 : -1,
            speed: Math.random() * (0.1 - 0.05) + 0.05,
            elements: [],
        });
    }

    // Criar faixas de troncos
    for (let i = 0; i < 4; i++) {
        let z = -1 - i * 2;
        lanes.push({
            z,
            type: 'log',
            direction: i % 2 === 0 ? 1 : -1,
            speed: Math.random() * (0.1 - 0.05) + 0.05,
            elements: [],
        });
    }

    // Adicionar objetos às faixas
    lanes.forEach(lane => {
        for (let i = 0; i < 6; i++) {
            const obj = lane.type === 'car' ? createCar() : createLog();
            obj.position.set(i * 6 - 20, 0.2, lane.z);
            if (lane.type === 'car' && lane.direction === -1) {
                obj.rotation.y = Math.PI;
            }
            scene.add(obj);
            lane.elements.push(obj);
        }
    });

    // Controlos do sapo
    document.addEventListener('keydown', (event) => {
        if (jumping || event.repeat) return;

        let targetX = frog.position.x;
        let targetZ = frog.position.z;
        let rotation = frog.rotation.y;

        switch (event.key) {
            case 'ArrowUp':
                targetZ -= 2;
                rotation = 0;
                jumping = true;
                jumpSound.currentTime = 0;
                jumpSound.play();
                break;
            case 'ArrowDown':
                targetZ += 2;
                rotation = Math.PI;
                jumping = true;
                jumpSound.currentTime = 0;
                jumpSound.play();
                break;
            case 'ArrowLeft':
                targetX -= 2;
                rotation = Math.PI / 2;
                jumping = true;
                jumpSound.currentTime = 0;
                jumpSound.play();
                break;
            case 'ArrowRight':
                targetX += 2;
                rotation = -Math.PI / 2;
                jumping = true;
                jumpSound.currentTime = 0;
                jumpSound.play();
                break;
            default:
                return;
        }

        frog.rotation.y = rotation;

        // Animação do salto com GSAP
        gsap.to(frog.position, {
            duration: 0.05,
            y: 1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(frog.position, {
                    duration: 0.05,
                    y: 0,
                    ease: "bounce.out"
                });
            }
        });

        gsap.to(frog.position, {
            duration: 0.1,
            x: targetX,
            z: targetZ,
            ease: "power1.inOut",
            onComplete: () => {
                jumping = false;
            }
        });
    });

    atualizarVidas();
    document.getElementById("score").style.display = "block";
}

export function gameLoop(scene, camera) {
    lanes.forEach(lane => {
        lane.elements.forEach(obj => {
            obj.position.x += lane.speed * lane.direction;

            if (lane.direction === 1 && obj.position.x > 20) {
                obj.position.x = -20;
            } else if (lane.direction === -1 && obj.position.x < -20) {
                obj.position.x = 20;
            }
        });
    });

    verificarColisoes();
}

function atualizarVidas() {
    const vidasElement = document.getElementById("lives");
    vidasElement.textContent = "❤️".repeat(vidas);
}

function atualizarScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Pontos: ${score}`;
}

function getCars() {
    return lanes.filter(lane => lane.type === 'car').flatMap(lane => lane.elements);
}

export function verificarColisoes() {
    const carros = getCars();
    const frogBox = new THREE.Box3().setFromObject(frog);

    // Verificar colisão com carros (perder vida)
    for (let carro of carros) {
        const carroBox = new THREE.Box3().setFromObject(carro);
        if (frogBox.intersectsBox(carroBox)) {
            vidas--;
            atualizarVidas();

            frog.position.set(0, 0, 11);
            jumping = false;

            // Tocar som de perder
            loseSound.currentTime = 0;
            loseSound.play();

            if (vidas <= 0) {
                setTimeout(() => {
                    alert("💀 Fim de jogo!");
                    location.reload();
                }, 100);
            }

            return;
        }
    }

    // Verificar checkpoints
    checkpoints.forEach((cp, index) => {
        if (checkpointsVisitados.has(index)) return;

        const cpBox = new THREE.Box3().setFromObject(cp);
        if (frogBox.intersectsBox(cpBox)) {
            checkpointsVisitados.add(index);
            score++;
            atualizarScore();

            cp.material.color.set(0xffff00);

            frog.position.set(0, 0, 11);
            jumping = false;

            // Tocar som do checkpoint
            checkpointSound.currentTime = 0;
            checkpointSound.play();

            // Verificar se todos os checkpoints foram visitados (ganhar)
            if (checkpointsVisitados.size === checkpoints.length) {
                setTimeout(() => {
                    // Tocar som de vitória
                    winSound.currentTime = 0;
                    winSound.play();

                    alert("🎉 Parabéns! Completaste todos os checkpoints!");
                    location.reload();
                }, 100);
            }
        }
    });
}
export function setObstacleSpeedMultiplier(multiplier) {
    obstacleSpeedMultiplier = multiplier;
    // Atualiza a velocidade dos obstáculos, ex:
    // cars.forEach(car => car.speed = car.baseSpeed * obstacleSpeedMultiplier);
}

export function getObstacleSpeedMultiplier() {
    return obstacleSpeedMultiplier;
}

export function setGlobalVolume(volume) {
    globalVolume = volume;
    // Atualiza o volume de todos os sons, ex:
    // jumpSound.volume = volume;
    // backgroundMusic.volume = volume * 0.4;
    // otherSounds.forEach(sound => sound.volume = volume);
}

export function getGlobalVolume() {
    return globalVolume;
}