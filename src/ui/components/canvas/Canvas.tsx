import React, { useRef, useEffect } from 'react';
import { canvasConfig } from './canvas/canvasConfig';
import { dibujarEscenario } from './escenario/escenario';
import { Protagonista } from './models/Protagonista';
import { Enemigo } from './models/Enemigo';
import { principal } from './gameLoop/mainLoop';

import logo512 from '../../../assets/images/logo512.png';
import logo192 from '../../../assets/images/logo192.png';

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            // Ajustar el tamaño del canvas a la ventana
            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            
            // Llamar al ajuste inicial y en el evento resize
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            const context = canvasConfig(canvas);
            contextRef.current = context;

            // Dibuja el escenario
            if (context) {
                dibujarEscenario(context);
            }

            const prota = new Protagonista(225, 450, 50, 50, 'blue', 2);

            // Lista de imágenes para el enemigo
            const imagenesEnemigo = [logo512, logo192];
            const malo = new Enemigo(225, 250, 100, 100, 'red', 2, imagenesEnemigo);

            // Inicia la animación
            principal(prota, malo, contextRef.current);

            // Cleanup del evento resize
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, []);

    return (
        <canvas ref={canvasRef} id="myCanvas" style={{ border: '5px solid black' }} />
    );
};

export default Canvas;

