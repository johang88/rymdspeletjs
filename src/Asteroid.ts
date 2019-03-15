/// <reference path="rse/ResourceManager.ts" />
/// <reference path="rse/SpriteBatch.ts" />
/// <reference path="rse/Math.ts" />
/// <reference path="rse/Texture.ts" />
/// <reference path="rse/Sprite.ts" />
/// <reference path="Entity.ts" />

enum AsteroidSize {
    Small,
    Medium,
    Large,
    SmallGreen,
    MediumGreen,
    LargeGreen,
    LargeManySmall
}

class Asteroid extends Entity {
    private damage:number;
    private spawnedByWarp:number;
    private asteroidSize:AsteroidSize;
    private rotationSpeed:number;
    private health:number;
    private maxHealth:number;
    private value:number;
    private moneyValue:number;
    private spawnTable:SpawnTable;
    private texture:rse.Texture;
    private sprite:rse.Sprite;

    constructor(texture:rse.Texture) {
        super(0, EntityType.Asteroid);
        
        this.size = 32;
        this.texture = texture;

        this.sprite = new rse.Sprite();
        this.sprite.scale = new rse.Vec2(1, 1);
        this.sprite.color = rse.Color.White;
        this.sprite.rect = new rse.Rect(0, 0, 128, 128);
        this.sprite.texture = this.texture;
        this.sprite.origin = new rse.Vec2(64, 64);
        this.sprite.blendMode = rse.BlendMode.Alpha;
    }

    init(entityManager:EntityManager, resourceManager:rse.ResourceManager) {
        this.id = entityManager.getNextId();

        super.init(entityManager, resourceManager);

        // TODO: Load from table
        this.damage = 70;
        this.value = 540;
        this.moneyValue = 450;

        let minSpeed = 185;
        let maxSpeed = 325;

        let speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        this.velocity = new rse.Vec2(speed, speed);

        this.health = this.maxHealth = 360;
        this.size = 64;

        this.rotation = Math.random() * Math.PI * 2.0;
        this.rotationSpeed  = Math.random() - 0.5;
    }

    update(stepSize:number) {
        super.update(stepSize);

        this.rotation += this.rotationSpeed * stepSize;

        if (this.spawnedByWarp > 0.0)
            this.spawnedByWarp -= stepSize;
    }

    render(alpha:number, spriteBatch:rse.SpriteBatch) {
        super.render(alpha, spriteBatch);

        let pos = new rse.Vec2(
            rse.lerp(this.previousPosition.x, this.position.x, alpha),
            rse.lerp(this.previousPosition.y, this.position.y, alpha)
        );

        this.sprite.position = pos;
        this.sprite.rotation = this.rotation;

        spriteBatch.drawSprite(this.sprite);
    }

    handleEvent(evt:Evt) {
        super.handleEvent(evt);
    }

    construct(asteroidSize:AsteroidSize) {
        this.asteroidSize = asteroidSize;
        this.rotationSpeed = 0;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.value = 0;
        this.moneyValue = 0;
        this.spawnedByWarp = 0;
    }

    getDamage():number {
        return this.damage;
    }

    hurt(inflictor:Entity, damage:number) {
        super.hurt(inflictor, damage);
    }
}