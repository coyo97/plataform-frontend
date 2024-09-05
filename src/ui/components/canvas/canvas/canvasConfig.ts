// canvasConfig.ts



export function canvasConfig(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Context not found");

    canvas.width = 500;
    canvas.height = 500;
    canvas.style.border = '5px solid black';

    return context;
}

export function borrarCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (context) {
        canvas.width = 500;
        canvas.height = 500;
    }
}

