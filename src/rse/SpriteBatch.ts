namespace rse {
    class SpriteInfo {
        points:{x:number,y:number,u:number,v:number}[];
        color:Color;
        blendMode:BlendMode;
        texture:WebGLTexture;
        flags:number;
    }

    export enum TextAlignment {
        Left,
        Right,
        Center
    }

    export class SpriteBatch {
        private sprites:SpriteInfo[];

        private vertexBuffer:WebGLBuffer;

        constructor() {
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        }

        drawSprite(sprite:Sprite) {
        }

        drawColoredRect(rect:Rect, color:Color) {
        }

        drawTexture(rect:Rect, uv:Rect, color:Color, texture:Texture) {
        }

        // todo: print methods here ...

        // Submit pending draw calls
        submit(width:number, height:number, shaderFlags:number = -1) {
        }
    }
}