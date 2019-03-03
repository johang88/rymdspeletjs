namespace rse {
    class SpriteInfo {
        points:{x:number,y:number,u:number,v:number}[];
        color:Color;
        blendMode:BlendMode;
        texture:WebGLTexture;
        flags:number;
    }
}