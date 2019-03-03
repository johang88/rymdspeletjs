
var gl:WebGLRenderingContext = null;

class Renderer {
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

class Texture {
    private handle:WebGLTexture;
    private width:number;
    private height:number;

    constructor(width:number, height:number) {
        this.width = width;
        this.height = height;

        // Create texture
        this.handle = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.handle);

        // Setup texture paramters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, 0);
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.handle);
    }

    static fromUrl(url:string, callback:(texture:Texture)=>void) {
        let img = new Image();
        img.addEventListener('load', () => {
            let texture = new Texture(img.width, img.height);

            // Upload image data
            texture.bind();
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.bindTexture(gl.TEXTURE_2D, 0);

            callback(texture);
        });
    }
}

class Color {

}

enum BlendMode {

}

class SpriteInfo {
    points:{x:number,y:number,u:number,v:number}[];
    color:Color;
    blendMode:BlendMode;
    texture:WebGLTexture;
    flags:number;
}

class SpriteBatch {

}

let renderer = new Renderer("#glCanvas");
