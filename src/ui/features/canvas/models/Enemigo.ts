import { Protagonista } from "./Protagonista";

export class Enemigo extends Protagonista {
    derecha: boolean = true;
    imagenes: HTMLImageElement[] = [];
    imagenActual: HTMLImageElement;
    indiceImagen: number = 0;

    constructor(posX: number, posY: number, ancho: number, alto: number, color: string, velocidad: number, imagenes: string[]) {
        super(posX, posY, ancho, alto, color, velocidad);
        
        this.imagenes = imagenes.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        this.imagenActual = this.imagenes[this.indiceImagen];
    }

    dibuja(context: CanvasRenderingContext2D) {
        context.clearRect(this.posX, this.posY, this.ancho, this.alto);
        context.drawImage(this.imagenActual, this.posX, this.posY, this.ancho, this.alto);
    }

    mover(canvasWidth: number) {
        if (this.derecha) {
            if (this.posX < canvasWidth - this.ancho) {
                this.posX += this.velocidad;
            } else {
                this.derecha = false;
                this.cambiarImagen();
            }
        } else {
            if (this.posX > 0) {
                this.posX -= this.velocidad;
            } else {
                this.derecha = true;
                this.cambiarImagen();
            }
        }
    }

    cambiarImagen() {
        this.indiceImagen = (this.indiceImagen + 1) % this.imagenes.length;
        this.imagenActual = this.imagenes[this.indiceImagen];
    }
}

