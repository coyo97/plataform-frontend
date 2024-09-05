// src/ui/components/canvas/gameLoop/mainLoop.ts
import { borrarCanvas } from '../canvas/canvasConfig';
import { Protagonista } from '../models/Protagonista';
import { Enemigo } from '../models/Enemigo';

export function principal(prota: Protagonista, malo: Enemigo, context: CanvasRenderingContext2D | null) {
    requestAnimationFrame(() => principal(prota, malo, context));
    if (context) {
        borrarCanvas(context.canvas); // Utiliza el contexto del canvas
        prota.dibuja(context);
        malo.dibuja(context);
        malo.mover();
    }
}

