import { createFrog, createCar, createLog } from './objects.js';

export function initGame(scene, camera) {
    const frog = createFrog();
    scene.add(frog);
    camera.position.set(0, 10, 10);
    camera.lookAt(frog.position);

    let jumping = false; 
    
    const jumpDuration = 0.1; // Duração do salto em segundos
    const jumpHeight = 1; // Altura do salto em unidades de jogo
    const jumpDistance = 1; // Distância do salto em unidades de jogo


    const cars = [];
    for (let i = -10; i < 15; i++) {
        const car = createCar();
        car.position.set(i * 4 - 8, 0.1, -2);
        scene.add(car);
        cars.push(car);
    }

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
