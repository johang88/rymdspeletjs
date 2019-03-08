namespace rse {
    class SpriteInfo {
        points:{x:number,y:number,u:number,v:number}[];
        color:Color;
        blendMode:BlendMode;
        texture:WebGLTexture;
        flags:number;

        constructor() {
            for (let i = 0; i < 6; i++) {
                this.points.push({x: 0, y: 0, u: 0, v: 0});
            }
        }
    }

    export enum TextAlignment {
        Left,
        Right,
        Center
    }

    function rotatePoint(p:Vec2, r:number) {
        let tx = p.x;
        let ty = p.y;

        let sr = Math.sin(r);
        let cr = Math.cos(r);

        p.x = tx * cr - ty * sr;
        p.y = tx * sr + ty * cr;
    }

    function translatePoint(p:Vec2, t:Vec2) {
        p.x += t.x;
        p.y += t.y;
    }

    export class SpriteBatch {
        private sprites:SpriteInfo[];

        private vertexBuffer:WebGLBuffer;
        private vao:WebGLVertexArrayObject;

        constructor() {
            // Allocate vertex buffer
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            // Setup VAO
            this.vao = gl.createVertexArray();

            gl.bindVertexArray(this.vao);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            
            let size = 4 * 8;

            // Position
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, size, 0);

            // UV
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, size, 4 * 2);

            // Color
            gl.enableVertexAttribArray(2);
            gl.vertexAttribPointer(2, 4, gl.FLOAT, false, size, 4 * 4);
        }

        drawSprite(sprite:Sprite) {
            let rect = new Rect(sprite.rect.x, sprite.rect.y, sprite.rect.w, sprite.rect.h);

            let origin = sprite.origin;
            let scale = sprite.scale;

            let tw = 1.0, th = 1.0;
            if (sprite.texture) {
                th = sprite.texture.getWidth();
                th = sprite.texture.getHeight();
            }

            // Calculate uv coordinates
            let uv = new Rect();
            uv.x = rect.x / tw;
            uv.y = rect.y / th;
            uv.w = uv.x + rect.w / tw;
            uv.h = uv.y + rect.h / th;

            // Scale
            rect.x = 0;
            rect.y = 0 ;
            rect.w *= scale.x;
            rect.h *= scale.y;

            // Adjust origin
            rect.x -= origin.x * scale.x;
            rect.y -= origin.y * scale.y;
            rect.w -= origin.x * scale.x;
            rect.h -= origin.y * scale.y;

            // Setup sprite parameters
            let spriteInfo = new SpriteInfo();
            this.sprites.push(spriteInfo);

            spriteInfo.color = sprite.color;
            spriteInfo.texture = sprite.texture ? sprite.texture.getHandle() : null;
            spriteInfo.blendMode = sprite.blendMode;
            spriteInfo.flags = 0;

            spriteInfo.points[0] = { x: rect.x, y: rect.y, u: uv.x, v: uv.y };
            spriteInfo.points[1] = { x: rect.x, y: rect.h, u: uv.x, v: uv.h };
            spriteInfo.points[2] = { x: rect.w, y: rect.h, u: uv.w, v: uv.h };
            spriteInfo.points[3] = { x: rect.x, y: rect.y, u: uv.x, v: uv.y };
            spriteInfo.points[4] = { x: rect.w, y: rect.h, u: uv.w, v: uv.h };
            spriteInfo.points[5] = { x: rect.w, y: rect.y, u: uv.w, v: uv.y };

            // Rotate
            if (sprite.rotation < 0.0 || sprite.rotation > 0.0) {
                rotatePoint(spriteInfo.points[0], sprite.rotation);
                rotatePoint(spriteInfo.points[1], sprite.rotation);
                rotatePoint(spriteInfo.points[2], sprite.rotation);
                rotatePoint(spriteInfo.points[3], sprite.rotation);
                rotatePoint(spriteInfo.points[4], sprite.rotation);
                rotatePoint(spriteInfo.points[5], sprite.rotation);
            }

            // Translate
            translatePoint(spriteInfo.points[0], sprite.position);
            translatePoint(spriteInfo.points[1], sprite.position);
            translatePoint(spriteInfo.points[2], sprite.position);
            translatePoint(spriteInfo.points[3], sprite.position);
            translatePoint(spriteInfo.points[4], sprite.position);
            translatePoint(spriteInfo.points[5], sprite.position);
        }

        drawTexture(rect:Rect, uv:Rect, color:Color, texture:Texture) {
            let spriteInfo = new SpriteInfo();
            this.sprites.push(spriteInfo);

            spriteInfo.color = color;
            spriteInfo.texture = texture.getHandle();
            spriteInfo.blendMode = BlendMode.Alpha;
            spriteInfo.flags = 0;

            spriteInfo.points[0] = { x: rect.x, y: rect.y, u: uv.x, v: uv.y };
            spriteInfo.points[1] = { x: rect.x, y: rect.h, u: uv.x, v: uv.h };
            spriteInfo.points[2] = { x: rect.w, y: rect.h, u: uv.w, v: uv.h };
            spriteInfo.points[3] = { x: rect.x, y: rect.y, u: uv.x, v: uv.y };
            spriteInfo.points[4] = { x: rect.w, y: rect.h, u: uv.w, v: uv.h };
            spriteInfo.points[5] = { x: rect.w, y: rect.y, u: uv.w, v: uv.y };
        }

        // todo: print methods here ...

        // Submit pending draw calls
        submit(width:number, height:number, shaderFlags:number = -1) {
            if (this.sprites.length == 0)
                return;

            // TODO: Sort sprites

            

            this.sprites = [];
        }
    }
}