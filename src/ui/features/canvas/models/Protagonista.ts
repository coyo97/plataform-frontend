// src/ui/components/canvas/models/Protagonista.ts


export class Protagonista {
    posX: number;
    posY: number;
    ancho: number;
    alto: number;
    color: string;
    velocidad: number;

    constructor(posX: number, posY: number, ancho: number, alto: number, color: string, velocidad: number) {
        this.posX = posX;
        this.posY = posY;
        this.ancho = ancho;
        this.alto = alto;
        this.color = color;
        this.velocidad = velocidad;
    }

	dibuja(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.fillRect(this.posX, this.posY, this.ancho, this.alto);
	}
}

