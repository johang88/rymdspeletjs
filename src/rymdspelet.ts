/// <reference path="rse/Renderer.ts" />
/// <reference path="rse/Shader.ts" />
/// <reference path="rse/Texture.ts" />
/// <reference path="rse/SpriteBatch.ts" />
/// <reference path="rse/Math.ts" />

let renderer = new rse.Renderer("#glCanvas");

let shader = rse.Shader.fromScript("sprite_vertex_shader", "sprite_fragment_shader", [ "TEXTURED" ]);

class GameState {
    texture:rse.Texture = null;
}

let state = new GameState();

rse.Texture.fromUrl('data/textures/background1.png', texture => {
    state.texture = texture;  
});

let spriteBatch = new rse.SpriteBatch(shader);

function tick() {
    if (state.texture != null) {
        gl.viewport(0, 0, 1920, 1080);
        
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        spriteBatch.drawTexture(new rse.Rect(0, 0, 1920, 1080), new rse.Rect(0, 0, 1920 / 2048, 1080 / 2048), rse.Color.White, state.texture);
        spriteBatch.submit(1920, 1080, null);
    }
    else {
        window.requestAnimationFrame(tick);
    }
}

window.requestAnimationFrame(tick);