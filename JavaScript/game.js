import { createFrog, createCar, createLog, createWater } from './objects.js';

let lanes = [];

export function initGame(scene, camera) {
    const frog = createFrog();
    frog.position.set(0, 0, 11);
    scene.add(frog);
    camera.position.set(0, 6, 12);
    camera.lookAt(0, -5, 0);

    const water = createWater(); // Criar água na posição z = -1
    water.position.set(0, 0.1, -4.5); // Ajustar a posição da água
    scene.add(water);
    

    let jumping = false; 
    
    const jumpDuration = 0.1; // Duração do salto em segundos
    const jumpHeight = 1; // Altura do salto em unidades de jogo
    const jumpDistance = 2; // Distância do salto em unidades de jogo


    // Criar faixas: 5 estrada (z = 1,3,5,7,9), 5 rio (z = -1,-3,-5,-7,-9)
    for (let i = 0; i < 4; i++) {
        let z = 1 + i * 2;
        lanes.push({
            z,
            type: 'car',
            direction: i%2 === 0 ? 1 : -1, // Direção alternada
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
            direction: i%2 === 0 ? 1 : -1, // Direção alternada
            speed: Math.random() * (0.1 - 0.05) + 0.05, // Velocidade aleatória entre 0.005 e 0.01
            elements: [],
        });
    }

    // Criar objetos nas faixas
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


    document.addEventListener('keydown', (event) => {
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
            duration: jumpDuration/2,
            y: jumpHeight,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(frog.position, {
                    duration: jumpDuration/2,
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
    
}
