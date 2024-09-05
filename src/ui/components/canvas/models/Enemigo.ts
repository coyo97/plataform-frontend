import { Protagonista } from "./Protagonista";

export class Enemigo extends Protagonista {
    derecha: boolean = true;
    imagenes: HTMLImageElement[] = [];
    imagenActual: HTMLImageElement;
    indiceImagen: number = 0;

    constructor(posX: number, posY: number, ancho: number, alto: number, color: string, velocidad: number, imagenes: string[]) {
        super(posX, posY, ancho, alto, color, velocidad);
        
        // Cargar las imágenes
        this.imagenes = imagenes.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        // Establecer la imagen actual
        this.imagenActual = this.imagenes[this.indiceImagen];
    }

    dibuja(context: CanvasRenderingContext2D) {
        context.clearRect(this.posX, this.posY, this.ancho, this.alto); // Limpiar la posición anterior
        context.drawImage(this.imagenActual, this.posX, this.posY, this.ancho, this.alto);
    }

    mover() {
        if (this.derecha) {
            if (this.posX < 500 - this.ancho) {
                this.posX += this.velocidad;
            } else {
                this.derecha = false;
                this.cambiarImagen(); // Cambiar la imagen en colisión
            }
        } else {
            if (this.posX > 0) {
                this.posX -= this.velocidad;
            } else {
                this.derecha = true;
                this.cambiarImagen(); // Cambiar la imagen en colisión
            }
        }
    }

    cambiarImagen() {
        this.indiceImagen = (this.indiceImagen + 1) % this.imagenes.length;
        this.imagenActual = this.imagenes[this.indiceImagen];
    }
}

