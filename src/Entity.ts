/// <reference path="rse/ResourceManager.ts" />
/// <reference path="rse/SpriteBatch.ts" />
/// <reference path="rse/Math.ts" />

var WIDTH:number = 1920;
var HEIGHT:number = 1070;

enum EntityType {
    Ship,
    Asteroid,
    Bullet,
    Explosion
}

class Entity {
    protected id:number;
    protected type:EntityType;
    protected alive:boolean;
    protected size:number;
    protected position:rse.Vec2;
    protected rotation:number;
    protected previousPosition:rse.Vec2;
    protected wrap:boolean;
    protected velocity:rse.Vec2;

    protected entityManager:EntityManager;

    constructor(id:number, type:EntityType) {
        this.id = id;
        this.type = type;
        this.wrap = true;
        this.position = new rse.Vec2();
        this.previousPosition = new rse.Vec2();
        this.rotation = 0;
    }

    init(entityManager:EntityManager, resourceManager:rse.ResourceManager) {
        this.alive = true;
        this.entityManager = entityManager;
    }

    update(stepSize:number) {
        if (this.wrap) {
            if (this.position.x < -this.size) {
                this.position.x = WIDTH + this.size;
            } else if (this.position.x > WIDTH + this.size) {
                this.position.x = -this.size;
            }

            if (this.position.y < -this.size) {
                this.position.y = HEIGHT + this.size;
            } else if (this.position.y > HEIGHT + this.size) {
                this.position.y = -this.size;
            }
        }

        this.previousPosition = new rse.Vec2(this.position.x, this.position.y);

        this.position.x += Math.sin(this.rotation) * this.velocity.x * stepSize;
        this.position.y -= Math.cos(this.rotation) * this.velocity.y * stepSize;
    }

    render(alpha:number, spriteBatch:rse.SpriteBatch) {
    }

    handleEvent(evt:Evt) {
    }

    setPosition(p:rse.Vec2) {
        this.position = new rse.Vec2(p.x, p.y);
        this.previousPosition = new rse.Vec2(p.x, p.y);
    }

    getId():number {
        return this.id;
    }

    getType():EntityType {
        return this.type;
    }

    isAlive():boolean {
        return this.alive;
    }

    intersects(other:Entity):boolean {
        return rse.circleIntersectCirlce(this.position.x, this.position.y, this.size, other.position.x, other.position.y, other.size);
    }

    hurt(inflictor:Entity, damage:number) {
    }

    getSize() {
        return this.size;
    }
    
    getPosition():rse.Vec2 {
        return this.position;
    }

    getPreviousPosition():rse.Vec2 {
        return this.position;
    }

    getRotation():number {
        return this.rotation;
    }
}