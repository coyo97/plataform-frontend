export function canvasConfig(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Context not found");

    // Ajuste dinámico de tamaño en función de la pantalla
    canvas.width = window.innerWidth * 0.9; // 90% del ancho de la pantalla
    canvas.height = window.innerHeight * 0.8; // 80% de la altura de la pantalla
    canvas.style.border = '0px solid black';

    return context;
}

export function borrarCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (context) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.8;
    }
}

