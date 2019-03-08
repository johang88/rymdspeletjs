var rse;
(function (rse) {
    var Renderer = /** @class */ (function () {
        function Renderer(selector) {
            var canvas = document.querySelector(selector);
            gl = canvas.getContext("webgl2", {});
            if (gl == null) {
                alert("Unable to initialize WebGL context!");
                return;
            }
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        return Renderer;
    }());
    rse.Renderer = Renderer;
})(rse || (rse = {}));
var rse;
(function (rse) {
    function compileShader(type, source, defines) {
        var shader = gl.createShader(type);
        var definesString = defines.map(function (s) { return '#define ' + s; }).join('\n');
        source = definesString + '\n' + source;
        source = "#version 300 es\n" + source;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }
        return shader;
    }
    var Shader = /** @class */ (function () {
        function Shader(vertexShaderSource, fragmentShaderSource, defines) {
            var vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource, defines);
            var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource, defines);
            this.handle = gl.createProgram();
            gl.attachShader(this.handle, vertexShader);
            gl.attachShader(this.handle, fragmentShader);
            gl.linkProgram(this.handle);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            var success = gl.getProgramParameter(this.handle, gl.LINK_STATUS);
            if (!success) {
                throw "could not link shader " + gl.getProgramInfoLog(this.handle);
            }
        }
        Shader.prototype.use = function () {
            gl.useProgram(this.handle);
        };
        Shader.prototype.setUniformInt = function (index, value) {
            gl.uniform1i(index, value);
        };
        Shader.prototype.setUniformFloat = function (index, value) {
            gl.uniform1f(index, value);
        };
        Shader.prototype.setUniformVec4 = function (index, value) {
            gl.uniform4f(index, value.x, value.y, value.z, value.w);
        };
        Shader.prototype.setUniformColor = function (index, value) {
            gl.uniform4f(index, value.r / 255.0, value.g / 255.0, value.b / 255.0, value.a / 255.0);
        };
        Shader.fromScript = function (vertexShaderId, fragmentShaderId, defines) {
            if (defines === void 0) { defines = []; }
            var vertexShaderElement = document.getElementById(vertexShaderId);
            var fragmentShaderElement = document.getElementById(fragmentShaderId);
            var vertexShader = vertexShaderElement.text;
            var fragmentShader = fragmentShaderElement.text;
            return new Shader(vertexShader, fragmentShader, defines);
        };
        return Shader;
    }());
    rse.Shader = Shader;
})(rse || (rse = {}));
/// <reference path="rse/Renderer.ts" />
/// <reference path="rse/Shader.ts" />
var renderer = new rse.Renderer("#glCanvas");
var shader = rse.Shader.fromScript("sprite_vertex_shader", "sprite_fragment_shader");
var gl = null;
var rse;
(function (rse) {
    var Vec2 = /** @class */ (function () {
        function Vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Vec2;
    }());
    rse.Vec2 = Vec2;
    var Vec4 = /** @class */ (function () {
        function Vec4(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        return Vec4;
    }());
    rse.Vec4 = Vec4;
    var Rect = /** @class */ (function () {
        function Rect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        return Rect;
    }());
    rse.Rect = Rect;
    var Color = /** @class */ (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 0; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.White = new Color(1, 1, 1, 1);
        Color.Black = new Color(0, 0, 0, 1);
        Color.Red = new Color(1, 0, 0, 1);
        Color.Green = new Color(0, 1, 0, 1);
        Color.Blue = new Color(0, 0, 1, 1);
        return Color;
    }());
    rse.Color = Color;
    function lerp(x, y, a) {
        return x + a * (y - x);
    }
    rse.lerp = lerp;
    function smoothstep(x) {
        return x * x * (3 - 2 * x);
    }
    rse.smoothstep = smoothstep;
    function smoothlerp(x, y, a) {
        return lerp(x, y, smoothstep(a));
    }
    rse.smoothlerp = smoothlerp;
    function getRotationTo(x, y) {
        return Math.atan2(y, x);
    }
    rse.getRotationTo = getRotationTo;
    function circleIntersectCirlce(x1, y1, r1, x2, y2, r2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy) <= r1 + r2;
    }
    rse.circleIntersectCirlce = circleIntersectCirlce;
})(rse || (rse = {}));
var rse;
(function (rse) {
    var BlendMode;
    (function (BlendMode) {
        BlendMode[BlendMode["None"] = 0] = "None";
        BlendMode[BlendMode["Add"] = 1] = "Add";
        BlendMode[BlendMode["Alpha"] = 2] = "Alpha";
    })(BlendMode = rse.BlendMode || (rse.BlendMode = {}));
    var Sprite = /** @class */ (function () {
        function Sprite() {
        }
        return Sprite;
    }());
    rse.Sprite = Sprite;
})(rse || (rse = {}));
var rse;
(function (rse) {
    var SpriteInfo = /** @class */ (function () {
        function SpriteInfo() {
            for (var i = 0; i < 6; i++) {
                this.points.push({ x: 0, y: 0, u: 0, v: 0 });
            }
        }
        return SpriteInfo;
    }());
    var Vertex = /** @class */ (function () {
        function Vertex() {
        }
        return Vertex;
    }());
    var DrawCall = /** @class */ (function () {
        function DrawCall() {
        }
        return DrawCall;
    }());
    var TextAlignment;
    (function (TextAlignment) {
        TextAlignment[TextAlignment["Left"] = 0] = "Left";
        TextAlignment[TextAlignment["Right"] = 1] = "Right";
        TextAlignment[TextAlignment["Center"] = 2] = "Center";
    })(TextAlignment = rse.TextAlignment || (rse.TextAlignment = {}));
    function rotatePoint(p, r) {
        var tx = p.x;
        var ty = p.y;
        var sr = Math.sin(r);
        var cr = Math.cos(r);
        p.x = tx * cr - ty * sr;
        p.y = tx * sr + ty * cr;
    }
    function translatePoint(p, t) {
        p.x += t.x;
        p.y += t.y;
    }
    var SpriteBatch = /** @class */ (function () {
        function SpriteBatch(shader) {
            this.shader = shader;
            // Allocate vertex buffer
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            // Setup VAO
            this.vao = gl.createVertexArray();
            gl.bindVertexArray(this.vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            var size = 4 * 8;
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
        SpriteBatch.prototype.drawSprite = function (sprite) {
            var rect = new rse.Rect(sprite.rect.x, sprite.rect.y, sprite.rect.w, sprite.rect.h);
            var origin = sprite.origin;
            var scale = sprite.scale;
            var tw = 1.0, th = 1.0;
            if (sprite.texture) {
                th = sprite.texture.getWidth();
                th = sprite.texture.getHeight();
            }
            // Calculate uv coordinates
            var uv = new rse.Rect();
            uv.x = rect.x / tw;
            uv.y = rect.y / th;
            uv.w = uv.x + rect.w / tw;
            uv.h = uv.y + rect.h / th;
            // Scale
            rect.x = 0;
            rect.y = 0;
            rect.w *= scale.x;
            rect.h *= scale.y;
            // Adjust origin
            rect.x -= origin.x * scale.x;
            rect.y -= origin.y * scale.y;
            rect.w -= origin.x * scale.x;
            rect.h -= origin.y * scale.y;
            // Setup sprite parameters
            var spriteInfo = new SpriteInfo();
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
        };
        SpriteBatch.prototype.drawTexture = function (rect, uv, color, texture) {
            var spriteInfo = new SpriteInfo();
            this.sprites.push(spriteInfo);
            spriteInfo.color = color;
            spriteInfo.texture = texture.getHandle();
            spriteInfo.blendMode = rse.BlendMode.Alpha;
            spriteInfo.flags = 0;
            spriteInfo.points[0] = { x: rect.x, y: rect.y, u: uv.x, v: uv.y };
            spriteInfo.points[1] = { x: rect.x, y: rect.h, u: uv.x, v: uv.h };
            spriteInfo.points[2] = { x: rect.w, y: rect.h, u: uv.w, v: uv.h };
            spriteInfo.points[3] = { x: rect.x, y: rect.y, u: uv.x, v: uv.y };
            spriteInfo.points[4] = { x: rect.w, y: rect.h, u: uv.w, v: uv.h };
            spriteInfo.points[5] = { x: rect.w, y: rect.y, u: uv.w, v: uv.y };
        };
        // todo: print methods here ...
        // Submit pending draw calls
        SpriteBatch.prototype.submit = function (width, height, shaderFlags) {
            if (shaderFlags === void 0) { shaderFlags = -1; }
            if (this.sprites.length == 0)
                return;
            var currentTextureHandle = this.sprites[0].texture;
            var currentBlendMode = this.sprites[0].blendMode;
            var currentFlags = this.sprites[0].flags;
            var vertices = [];
            var drawCalls = [];
            var first = 0;
            // Prepare vertex data and draw calls
            for (var i = 0; i < this.sprites.length; i++) {
                var points = this.sprites[i].points;
                var color = this.sprites[i].color;
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
            var vertexData = new Float32Array(8 * vertices.length);
            for (var i = 0; i < vertices.length; i++) {
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
            for (var i = 0; i < drawCalls.length; i++) {
                if (drawCalls[i].texture) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, drawCalls[i].texture);
                }
                else {
                    gl.bindTexture(gl.TEXTURE_2D, 0);
                }
                switch (drawCalls[i].blendMode) {
                    case rse.BlendMode.None:
                        gl.disable(gl.BLEND);
                        gl.blendFunc(gl.ONE, gl.ZERO);
                        break;
                    case rse.BlendMode.Add:
                        gl.enable(gl.BLEND);
                        gl.blendFunc(gl.ONE, gl.ONE);
                        break;
                    case rse.BlendMode.Alpha:
                        gl.enable(gl.BLEND);
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                        break;
                }
                // TODO: Use shader bundle
                this.shader.use();
                gl.drawArrays(gl.TRIANGLES, drawCalls[i].first, drawCalls[i].count);
            }
            this.sprites = [];
        };
        return SpriteBatch;
    }());
    rse.SpriteBatch = SpriteBatch;
})(rse || (rse = {}));
var rse;
(function (rse) {
    var Texture = /** @class */ (function () {
        function Texture(width, height) {
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
        Texture.prototype.bind = function () {
            gl.bindTexture(gl.TEXTURE_2D, this.handle);
        };
        Texture.prototype.getWidth = function () {
            return this.width;
        };
        Texture.prototype.getHeight = function () {
            return this.height;
        };
        Texture.prototype.getHandle = function () {
            return this.handle;
        };
        Texture.fromUrl = function (url, callback) {
            var img = new Image();
            img.addEventListener('load', function () {
                var texture = new Texture(img.width, img.height);
                // Upload image data
                texture.bind();
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.bindTexture(gl.TEXTURE_2D, 0);
                callback(texture);
            });
        };
        return Texture;
    }());
    rse.Texture = Texture;
})(rse || (rse = {}));
//# sourceMappingURL=rymdspelet.js.map