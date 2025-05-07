export const casillaHorizontal = window.innerHeight * 0.08; // 8% de la altura de la pantalla
export const casillaVertical = window.innerWidth * 0.09; // 9% del ancho de la pantalla

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

