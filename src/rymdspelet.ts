/// <reference path="rse/Renderer.ts" />
/// <reference path="rse/Shader.ts" />
/// <reference path="rse/Texture.ts" />
/// <reference path="rse/SpriteBatch.ts" />
/// <reference path="rse/Math.ts" />
/// <reference path="rse/ResourceManager.ts" />

let renderer = new rse.Renderer("#glCanvas");

let shader = rse.Shader.fromScript("sprite_vertex_shader", "sprite_fragment_shader", [ "TEXTURED" ]);

class GameState {
    texture:rse.Texture = null;
    ship:rse.Texture = null;
    asteroid:rse.Texture = null;
    init:boolean = true;
}

let state = new GameState();

rse.Texture.fromUrl('data/textures/background1.png', texture => {
    state.texture = texture;  
});

rse.Texture.fromUrl('data/textures/ship.png', texture => {
    state.ship = texture;  
});

rse.Texture.fromUrl('data/textures/medium_green_asteroid.png', texture => {
    state.asteroid = texture;  
});

let spriteBatch = new rse.SpriteBatch(shader);
let resourceManager = new rse.ResourceManager();
let entityManager = new EntityManager(new TableManager(), resourceManager);

function tick() {
    if (state.texture && state.ship && state.asteroid) {
        if (state.init) {
            state.init = false;

            // Create asteroids
            for (let i = 0; i < 10; i++) {
                let position = new rse.Vec2(200 + i * 160, 200 + i * 140);
                
                let asteroid = new Asteroid(state.asteroid);

                asteroid.construct(AsteroidSize.MediumGreen);
                asteroid.init(entityManager, resourceManager);

                asteroid.setPosition(position);

                entityManager.addEntity(asteroid);
            }
        }

        gl.viewport(0, 0, 1920, 1080);
        
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        spriteBatch.drawTexture(new rse.Rect(0, 0, 1920, 1080), new rse.Rect(0, 0, 1920 / 2048, 1080 / 2048), rse.Color.White, state.texture);
        
        entityManager.update(1.0 / 60.0);
        entityManager.render(1.0, spriteBatch);

        spriteBatch.submit(1920, 1080, null);
    }

    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);