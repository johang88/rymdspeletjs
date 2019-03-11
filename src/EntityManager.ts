/// <reference path="rse/ResourceManager.ts" />
/// <reference path="rse/SpriteBatch.ts" />
/// <reference path="rse/Math.ts" />

enum EventType {
    Test = 1,
    Collision = 2,
    Accelerate = 4,
    Brake = 8,
    RotateLeft = 16,
    RotateRight = 32,
    Shoot = 64,
    Remove = 128,
    Boost = 256,
    Boom = 512
}

class Evt {
    eventType:EventType;
    source:number;
    target:number;
    data1:number;
    data2:number;
}

class EntityManager {
    private nextId:number = 0;

    constructor(tableManager:TableManager, resourceManager:rse.ResourceManager) {
    }

    addEntity(entity:Entity) {
    }

    removeEntity(entity:Entity) {
    }

    sendEvent(eventType:EventType, source:number, target:number, data1:number = 0, data2:number = 0):Evt {
        return null;
    }

    update(stepSize:number) {
    }

    render(alpha:number, spriteBatch:rse.SpriteBatch) {
    }

    getEntityById(id:number):Entity {
        return null;
    }

    getNextId():number {
        return this.nextId++;
    }

    destroyAllAsteroidsAt(position:rse.Vec2, radius:number, inflictor:Entity) {
    }

    clear() {
    }

    getNumberOfEntitiesOfType(type:EntityType):number {
        return 0;
    }

    getClosestEntityOfType(position:rse.Vec2, type:EntityType):Entity {
        return null;
    }
}