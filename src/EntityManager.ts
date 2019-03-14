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
    private tableManager:TableManager;
    private resourceManager:rse.ResourceManager

    private entities:{[id:number] : Entity} = {};
    private entitiesToAdd:Entity[] = [];
    private entitiesToRemove:Entity[] = [];
    private eventQueue:Evt[] = [];

    constructor(tableManager:TableManager, resourceManager:rse.ResourceManager) {
        this.tableManager = tableManager;
        this.resourceManager = resourceManager;
    }

    addEntity(entity:Entity) {
        entity.init(this, this.resourceManager);
        this.entitiesToAdd.push(entity);
    }

    removeEntity(entity:Entity) {
        this.entitiesToRemove.push(entity);
    }

    sendEvent(eventType:EventType, source:number, target:number, data1:number = 0, data2:number = 0):Evt {
        var event = new Evt();
        event.eventType = eventType;
        event.source = source;
        event.target = target;
        event.data1 = data1;
        event.data2 = data2;

        this.eventQueue.push(event);

        return event;
    }

    update(stepSize:number) {
        // Remove pending entitites
        for (let entity of this.entitiesToRemove) {
            delete this.entities[entity.getId()];
        }
        this.entitiesToRemove.length = 0;

        // Add pending entities
        for (let entity of this.entitiesToAdd) {
            this.entities[entity.getId()] = entity;
        }
        this.entitiesToAdd.length = 0;

        // Check for collisions
        for (let entityIdA in this.entities) {
            let entityA = this.entities[entityIdA];

            for (let entityIdB in this.entities) {
                if (entityIdA == entityIdB)
                    continue;
                
                let entityB = this.entities[entityIdB];

                if (entityA.intersects(entityB)) {
                    this.sendEvent(EventType.Collision, entityA.getId(), entityB.getId());
                }

                // Abort if dead
                if (!entityA.isAlive())
                    break;
            }
        }

        // Process events
        for (let evt of this.eventQueue) {
            let entity = this.getEntityById(evt.target);
            if (entity) {
                entity.handleEvent(evt);
            }
        }
        this.eventQueue.length = 0;

        // Update
        for (let entityId in this.entities) {
            let entity = this.entities[entityId];
            entity.update(stepSize);
        }
    }

    render(alpha:number, spriteBatch:rse.SpriteBatch) {
        for (let entityId in this.entities) {
            let entity = this.entities[entityId];
            entity.render(alpha, spriteBatch);
        }
    }

    getEntityById(id:number):Entity {
        return this.entities[id];
    }

    getNextId():number {
        return this.nextId++;
    }

    destroyAllAsteroidsAt(position:rse.Vec2, radius:number, inflictor:Entity) {
    }

    clear() {
        this.entities = [];
        this.entitiesToAdd.length = 0;
        this.entitiesToRemove.length = 0;
        this.eventQueue.length = 0;
    }

    getNumberOfEntitiesOfType(type:EntityType):number {
        return 0;
    }

    getClosestEntityOfType(position:rse.Vec2, type:EntityType):Entity {
        return null;
    }
}