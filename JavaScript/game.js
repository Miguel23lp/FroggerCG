import { createFrog, createCar, createLog } from './objects.js';

export function initGame(scene, camera) {
    const frog = createFrog();
    scene.add(frog);
    camera.position.set(0, 10, 10);
    camera.lookAt(frog.position);

    const cars = [];
    for (let i = 0; i < 5; i++) {
        const car = createCar();
        car.position.set(i * 4 - 8, 0.5, -2);
        scene.add(car);
        cars.push(car);
    }

    document.addEventListener('keydown', (event) => {
        let targetX = frog.position.x;
        let targetZ = frog.position.z;
        let rotation = frog.rotation.y;

        switch (event.key) {
            case 'ArrowUp':
                targetZ -= 1;
                rotation = 0;
                break;
            case 'ArrowDown':
                targetZ += 1;
                rotation = Math.PI;
                break;
            case 'ArrowLeft':
                targetX -= 1;
                rotation = Math.PI / 2;
                break;
            case 'ArrowRight':
                targetX += 1;
                rotation = -Math.PI / 2;
                break;
            default:
                return; // Ignora outras teclas
        }

        frog.rotation.y = rotation;

        // Animação do salto com GSAP
        gsap.to(frog.position, {
            duration: 0.2,
            y: 1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(frog.position, {
                    duration: 0.2,
                    y: 0,
                    ease: "bounce.out"
                });
            }
        });

        // Movimento horizontal e longitudinal durante o salto
        gsap.to(frog.position, {
            duration: 0.4,
            x: targetX,
            z: targetZ,
            ease: "power1.inOut"
        });
    });
}
