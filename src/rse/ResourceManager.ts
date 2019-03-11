namespace rse {
    export class ResourceManager {
        private textures:{[id:string] : Texture} = {};
        private sprites:{[id:string] : Sprite} = {};

        constructor() {
        }

        loadPackage(path:string, callback:()=>void) {
        }

        getTexture(name:string):Texture {
            return this.textures[name];
        }

        getSprite(name:string):Sprite {
            return this.sprites[name];
        }
    }
}