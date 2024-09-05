// src/ui/components/canvas/escenario/escenario.ts
export const casillaHorizontal: number = 50;
export const casillaVertical: number = 50;

export let escenario: number[][] = Array(10).fill(Array(10).fill(0));

export function dibujarEscenario(context: CanvasRenderingContext2D) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (escenario[x][y] === 0) {
                context.fillStyle = 'lightblue';
                context.fillRect(x * casillaVertical, y * casillaHorizontal, casillaVertical, casillaHorizontal);
            }
        }
    }
}

