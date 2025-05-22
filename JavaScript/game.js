import { createFrog, createCar, createLog, createWater } from './objects.js';

const jumpDuration = 0.1; // Duração do salto em segundos
const jumpHeight = 1; // Altura do salto em unidades de jogo
const jumpDistance = 2; // Distância do salto em unidades de jogo

const startLives = 3; // Número inicial de vidas

let currentCamera;
let currentScene;
let gameState;
let frog;
let jumping;
let lanes;
let lives;
let score;
let messageElement;
let livesElement;
let scoreElement;


// Create lives display element
function createLivesDisplay() {
    const livesElement = document.createElement('div');
    livesElement.id = 'lives';
    livesElement.style.position = 'absolute';
    livesElement.style.top = '20px';
    livesElement.style.left = '20px';
    livesElement.style.color = 'red';
    livesElement.style.fontSize = '32px';
    // Add CSS animation for lives
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { transform: scale(1.5); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        #lives {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
        }
        #lives:empty {
            display: none;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(livesElement);
    return livesElement;
}

// Create score display element
function createScoreDisplay() {
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '20px';
    scoreElement.style.right = '20px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '32px';
    // Add CSS animation for score
    const style = document.createElement('style');
    style.textContent = `
        #score {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(scoreElement);
    return scoreElement;
}

// Create message display element
function createMessageDisplay() {
    const messageElement = document.createElement('div');
    messageElement.id = 'message';
    messageElement.style.position = 'absolute';
    messageElement.style.top = '10%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.color = 'white';
    messageElement.style.fontSize = '24px';
    messageElement.style.fontFamily = 'Arial, sans-serif';
    messageElement.style.textAlign = 'center';
    messageElement.style.display = 'none';
    
    // Add CSS animation for blinking
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        #message {
            text-shadow: #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px,
             #000 0px 0px 1px,   #000 0px 0px 1px,   #000 0px 0px 1px;
        }
        .blink {
            animation: blink 1s infinite;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageElement);
    return messageElement;
}

function showMessage(message, shouldBlink = false) {
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    if (shouldBlink) {
        messageElement.classList.add('blink');
    } else {
        messageElement.classList.remove('blink');
    }
}

function hideMessage() {
    messageElement.style.display = 'none';
    messageElement.classList.remove('blink');
}

function createLanes() {
// Criar faixas: 5 estrada (z = 1,3,5,7,9), 5 rio (z = -1,-3,-5,-7,-9)
    for (let i = 0; i < 4; i++) {
        let z = 1 + i * 2;
        lanes.push({
            z,
            type: 'car',
            direction: i % 2 === 0 ? 1 : -1, // Direção alternada
            // velocidade aleatória entre 0.005 e 0.01
            speed: Math.random() * (0.1 - 0.05) + 0.05, // Velocidade aleatória entre 0.005 e 0.01
            elements: [],
        });
    }

    for (let i = 0; i < 4; i++) {
        let z = -1 - i * 2;
        lanes.push({
            z,
            type: 'log',
            direction: i % 2 === 0 ? 1 : -1, // Direção alternada
            speed: Math.random() * (0.1 - 0.05) + 0.05, // Velocidade aleatória entre 0.005 e 0.01
            elements: [],
        });
    }

    // Criar objetos nas faixas
    lanes.forEach(lane => {
        for (let i = 0; i < 6; i++) {
            let obj;

            if (lane.type === 'car') {
                obj = Math.random() < 0.8 ? createCar() : createVan();
            } else {
                obj = createLog();
            }

            obj.position.set(i * 6 - 20, 0.2, lane.z);

            if (lane.type === 'car' && lane.direction === -1) {
                obj.rotation.y = Math.PI;
            }

            scene.add(obj);
            lane.elements.push(obj);
        }
    });
}


function clearLanes() {
    lanes.forEach(lane => {
        lane.elements.forEach(obj => {
            obj.parent.remove(obj);
        });
    });
    lanes = [];
}


export function initGame(scene, camera) {
    currentScene = scene;
    currentCamera = camera;
    
    gameState = 'Play';
    frog = createFrog();
    currentScene.add(frog);
    jumping = false;
    lanes = [];
    lives = startLives;
    score = 0;
    messageElement = createMessageDisplay();
    livesElement = createLivesDisplay();
    scoreElement = createScoreDisplay();

    const water = createWater(); // Criar água na posição z = -1
    water.position.set(0, 0.1, -4.5); // Ajustar a posição da água
    currentScene.add(water);

    resetGame();
    respawnPlayer();

    document.addEventListener('keydown', (event) => {
        if (gameState === 'Dead') {
            if (event.code === 'Space') {
                respawnPlayer();
                return;
            }
        }

        if (gameState === 'Game Over') {
            if (event.code === 'Space') {// Reiniciar jogo
                resetGame();
                return;
            }
        }

        if (gameState !== 'Play') {
            return; // Ignore inputs if not in play state
        }

        let targetX = frog.position.x;
        let targetZ = frog.position.z;
        let rotation = frog.rotation.y;

        if (event.repeat) return;
        if (jumping) return; // Ignora se já estiver a saltar

        switch (event.key) {
            case 'ArrowUp':
                targetZ -= jumpDistance;
                rotation = 0;
                jumping = true;
                break;
            case 'ArrowDown':
                targetZ += jumpDistance;
                rotation = Math.PI;
                jumping = true;
                break;
            case 'ArrowLeft':
                targetX -= jumpDistance;
                rotation = Math.PI / 2;
                jumping = true;
                break;
            case 'ArrowRight':
                targetX += jumpDistance;
                rotation = -Math.PI / 2;
                jumping = true;
                break;
            default:
                return; // Ignora outras teclas
        }

        frog.rotation.y = rotation;

        if (!jumping) {
            return;
        }

        // Animação do salto com GSAP
        gsap.to(frog.position, {
            duration: jumpDuration / 2,
            y: jumpHeight,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(frog.position, {
                    duration: jumpDuration / 2,
                    y: 0,
                    ease: "bounce.out"
                });
            }
        });

        // Movimento horizontal e longitudinal durante o salto
        gsap.to(frog.position, {
            duration: jumpDuration,
            x: targetX,
            z: targetZ,
            ease: "power1.inOut",
            onComplete: () => {
                jumping = false; // Permite saltar novamente
            }
        });
    });
}

function resetGame() {
    lives = startLives;
    score = 0;
    updateLives();
    updateScore();

    respawnPlayer();
}

function respawnPlayer() {
    gameState = 'Play';
    hideMessage();
    
    clearLanes();
    createLanes();
    
    frog.position.set(0, 0, 11);
    frog.rotation.y = 0;
    currentCamera.position.set(0, 6, 12);
    currentCamera.lookAt(0, -5, 0);
}

export function gameLoop() {
    if (gameState !== 'Play') {
        return; // Stop game updates while dead
    }

    lanes.forEach(lane => {
        lane.elements.forEach(obj => {
            obj.position.x += lane.speed * lane.direction;

            if (lane.direction === 1 && obj.position.x > 25) {
                obj.position.x = -25;
            } else if (lane.direction === -1 && obj.position.x < -25) {
                obj.position.x = 25;
            }
        });
    });

    checkCollisions();
}

function checkCollisions() {
    let isOnLog = false;

    lanes.forEach(lane => {
        const isSameLane = Math.abs(frog.position.z - lane.z) < 0.5;

        if (lane.type === 'car' && isSameLane) {
            lane.elements.forEach(car => {
                if (Math.abs(frog.position.x - car.position.x) < 1.2) {
                    console.log("💥 Colisão com carro!");
                    handleLose();
                }
            });
        }

        if (lane.type === 'log' && isSameLane) {
            lane.elements.forEach(log => {
                if (Math.abs(frog.position.x - log.position.x) < 2.5) {
                    isOnLog = true;
                    // O sapo move-se com o tronco:
                    frog.position.x += lane.speed * lane.direction;
                }
            });

            if (!isOnLog) {
                // Sapo caiu na água
                handleLose();
            }
        }
    });

}

function handleLose() {
    console.log("💥 Game Over!");
    lives--;
    updateLives();
    
    if (lives <= 0) {
        gameState = 'Game Over';
        showMessage('Game Over!\nPress Space to restart');
    } else {
        gameState = 'Dead';
        showMessage(`Perdeu uma vida! ${lives} vidas restantes\nPressione espaço para continuar`, true);
    }
}

function updateLives() {
    // Create heart symbols (❤) for each life
    livesElement.textContent = '❤'.repeat(lives);
    
    // Add fade out animation when losing a life
    if (lives < startLives) {
        livesElement.style.animation = 'none';
        livesElement.offsetHeight; // Trigger reflow
        livesElement.style.animation = 'fadeOut 0.5s';
    }
}

function updateScore() {
    scoreElement.textContent = score;
}