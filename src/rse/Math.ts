namespace rse {
    export class Vec2 {
        x:number;
        y:number;

        constructor(x:number = 0, y:number = 0) {
            this.x = x;
            this.y = y;
        }
    }

    export class Vec4 {
        x:number;
        y:number;
        z:number;
        w:number;

        constructor(x:number = 0, y:number = 0, z:number = 0, w:number = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
    }

    export class Rect {
        x:number;
        y:number;
        w:number;
        h:number;

        constructor(x:number = 0, y:number = 0, w:number = 0, h:number = 0) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
    }

    export class Color {
        r:number;
        g:number;
        b:number;
        a:number;

        constructor(r:number = 0, g:number = 0, b:number = 0, a:number = 0) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        static readonly White = new Color(1, 1, 1, 1);
        static readonly Black = new Color(0, 0, 0, 1);
        static readonly Red = new Color(1, 0, 0, 1);
        static readonly Green = new Color(0, 1, 0, 1);
        static readonly Blue = new Color(0, 0, 1, 1);
    }

    export function lerp(x:number, y:number, a:number) {
        return x + a * (y - x);
    }

    export function smoothstep(x:number) {
        return x * x * (3 - 2 * x);
    }

    export function smoothlerp(x:number, y:number, a:number) {
        return lerp(x, y, smoothstep(a));
    }

    export function getRotationTo(x:number, y:number) {
        return Math.atan2(y, x);
    }

    export function circleIntersectCirlce(x1:number, y1:number, r1:number, x2:number, y2:number, r2:number) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        return Math.sqrt(dx * dx + dy * dy) <= r1 + r2;
    }
}