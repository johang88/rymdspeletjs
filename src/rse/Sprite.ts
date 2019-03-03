namespace rse {
    export enum BlendMode {
        None,
        Add,
        Alpha
    }

    export class Sprite {
        position:Vec2;
        scale:Vec2;
        color:Color;
        origin:Vec2;
        rect:Rect;
        rotation:number;
        blendMode:BlendMode;
        texture:Texture;
    }
}