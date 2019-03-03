namespace rse {
    export class Renderer {
        constructor(selector:string) {
            const canvas = <HTMLCanvasElement>document.querySelector(selector);
            gl = canvas.getContext("experimental-webgl", {});

            if (gl == null) {
                alert("Unable to initialize WebGL context!");
                return;
            }

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
    }
}