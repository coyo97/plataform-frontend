import { borrarCanvas } from '../canvas/canvasConfig';
import { Protagonista } from '../models/Protagonista';
import { Enemigo } from '../models/Enemigo';

export function principal(prota: Protagonista, malo: Enemigo, context: CanvasRenderingContext2D | null) {
    requestAnimationFrame(() => principal(prota, malo, context));
    if (context) {
        borrarCanvas(context.canvas); // Limpia el canvas
 //       prota.dibuja(context);
        malo.dibuja(context);
        malo.mover(context.canvas.width); // Ajusta el movimiento a la anchura del canvas
    }
}

