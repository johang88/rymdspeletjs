define("rse/renderer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gl = null;
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
    exports.Renderer = Renderer;
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
    var Color = /** @class */ (function () {
        function Color() {
        }
        return Color;
    }());
    var BlendMode;
    (function (BlendMode) {
    })(BlendMode || (BlendMode = {}));
    var SpriteInfo = /** @class */ (function () {
        function SpriteInfo() {
        }
        return SpriteInfo;
    }());
    var SpriteBatch = /** @class */ (function () {
        function SpriteBatch() {
        }
        return SpriteBatch;
    }());
});
define("rymdspelet", ["require", "exports", "rse/renderer"], function (require, exports, renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderer = new renderer_1.Renderer("#glCanvas");
});
//# sourceMappingURL=rymdspelet.js.map