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

    class Vertex {
        x:number;
        y:number;
        u:number;
        v:number;
        r:number;
        g:number;
        b:number;
        a:number;
    }

    class DrawCall {
        texture:WebGLTexture;
        blendMode:BlendMode;
        flags:number;
        first:number;
        count:number;
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

        private shader:Shader;

        constructor(shader:Shader) {
            this.shader = shader;

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

            let currentTextureHandle = this.sprites[0].texture;
            let currentBlendMode = this.sprites[0].blendMode;
            let currentFlags = this.sprites[0].flags;

            let vertices:Vertex[] = [];
            let drawCalls:DrawCall[] = [];
            let first = 0;

            // Prepare vertex data and draw calls
            for (let i = 0; i < this.sprites.length; i++) {
                let points = this.sprites[i].points;
                let color = this.sprites[i].color;

                // Triangle 1
                vertices.push({ x: points[0].x, y: points[0].y, u: points[0].y, v: points[0].v, r: color.r, g: color.g, b: color.b, a: color.a });
                vertices.push({ x: points[1].x, y: points[1].y, u: points[1].y, v: points[1].v, r: color.r, g: color.g, b: color.b, a: color.a });
                vertices.push({ x: points[2].x, y: points[2].y, u: points[2].y, v: points[2].v, r: color.r, g: color.g, b: color.b, a: color.a });

                // Triangle 2
                vertices.push({ x: points[3].x, y: points[3].y, u: points[3].y, v: points[3].v, r: color.r, g: color.g, b: color.b, a: color.a });
                vertices.push({ x: points[4].x, y: points[4].y, u: points[4].y, v: points[4].v, r: color.r, g: color.g, b: color.b, a: color.a });
                vertices.push({ x: points[5].x, y: points[5].y, u: points[5].y, v: points[5].v, r: color.r, g: color.g, b: color.b, a: color.a });

                if (i + 1 == this.sprites.length || currentTextureHandle != this.sprites[i + 1].texture || currentBlendMode != this.sprites[i + 1].blendMode || currentFlags != this.sprites[i + 1].flags) {
                    drawCalls.push({ texture: currentTextureHandle, blendMode: currentBlendMode, flags: currentFlags, first: first, count: vertices.length - first });

                    if (i + 1 < this.sprites.length) {
                        currentTextureHandle = this.sprites[i + 1].texture;
                        currentBlendMode = this.sprites[i + 1].blendMode;
                        currentFlags = this.sprites[i + 1].flags;
                    }

                    first = vertices.length;
                }
            }

            // Upload data
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            let vertexData = new Float32Array(8 * vertices.length);
            for (let i = 0; i < vertices.length; i++) {
                vertexData[i * 8 + 0] = vertices[i].x;
                vertexData[i * 8 + 1] = vertices[i].y;
                vertexData[i * 8 + 2] = vertices[i].u;
                vertexData[i * 8 + 3] = vertices[i].v;
                vertexData[i * 8 + 4] = vertices[i].r;
                vertexData[i * 8 + 5] = vertices[i].g;
                vertexData[i * 8 + 6] = vertices[i].b;
                vertexData[i * 8 + 7] = vertices[i].a;
            }

            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.DYNAMIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, 0);

            // Draw everything
            gl.bindVertexArray(this.vao);
            for (let i = 0; i < drawCalls.length; i++) {
                if (drawCalls[i].texture) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, drawCalls[i].texture);
                } else {
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }

                switch (drawCalls[i].blendMode) {
                    case BlendMode.None:
                        gl.disable(gl.BLEND);
                        gl.blendFunc(gl.ONE, gl.ZERO);
                    break;
                    case BlendMode.Add:
                        gl.enable(gl.BLEND);
                        gl.blendFunc(gl.ONE, gl.ONE);
                    break;
                    case BlendMode.Alpha:
                        gl.enable(gl.BLEND);
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                }

                // TODO: Use shader bundle
                this.shader.use();

                gl.drawArrays(gl.TRIANGLES, drawCalls[i].first, drawCalls[i].count);
            }

            this.sprites = [];
        }
    }
}