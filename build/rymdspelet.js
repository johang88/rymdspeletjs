var rse;
(function (rse) {
    var Renderer = /** @class */ (function () {
        function Renderer(selector) {
            var canvas = document.querySelector(selector);
            gl = canvas.getContext("experimental-webgl", {});
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
/// <reference path="rse/Renderer.ts" />
var renderer = new rse.Renderer("#glCanvas");
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
    function compileShader(type, source, defines) {
        var shader = gl.createShader(type);
        var definesString = defines.map(function (s) { return '#define ' + s; }).join('\n');
        source = definesString + '\n' + source;
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
        return Shader;
    }());
    rse.Shader = Shader;
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
        }
        return SpriteInfo;
    }());
    var TextAlignment;
    (function (TextAlignment) {
        TextAlignment[TextAlignment["Left"] = 0] = "Left";
        TextAlignment[TextAlignment["Right"] = 1] = "Right";
        TextAlignment[TextAlignment["Center"] = 2] = "Center";
    })(TextAlignment = rse.TextAlignment || (rse.TextAlignment = {}));
    var SpriteBatch = /** @class */ (function () {
        function SpriteBatch() {
            this.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        }
        SpriteBatch.prototype.drawSprite = function (sprite) {
        };
        SpriteBatch.prototype.drawColoredRect = function (rect, color) {
        };
        SpriteBatch.prototype.drawTexture = function (rect, uv, color, texture) {
        };
        // todo: print methods here ...
        // Submit pending draw calls
        SpriteBatch.prototype.submit = function (width, height, shaderFlags) {
            if (shaderFlags === void 0) { shaderFlags = -1; }
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