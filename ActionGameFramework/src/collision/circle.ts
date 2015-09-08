/// <reference path="shape.ts"/>
module Game {
    export class Circle extends AbstractShape {
        x: number;
        y: number;
        r: number;

        get width(): number { return this.r * 2; }
        set width(v: number) { this.r = v / 2; }
        get height(): number { return this.r * 2; }
        set height(v: number) { this.r = v / 2; }

        get left(): number { return this.x - this.r; }
        set left(v: number) { this.x = v + this.r; }
        get right(): number { return this.x + this.r; }
        set right(v: number) { this.x = v - this.r; }
        get top(): number { return this.y - this.r; }
        set top(v: number) { this.y = v + this.r; }
        get bottom(): number { return this.y + this.r; }
        set bottom(v: number) { this.y = v - this.r; }
        get centerx(): number { return this.x; }
        set centerx(v: number) { this.x = v; }
        get centery(): number { return this.y; }
        set centery(v: number) { this.y = v; }
        constructor(x: number, y: number, r: number, base: Circle = null) {
            super();
            this.x = x;
            this.y = y;
            this.r = r;
            if (base) {
                this.x += base.x;
                this.y += base.y;
                this.r += base.r;
            }
        }
        getParams(): Array<number> { // constructorに渡すことができる形式でパラメータの配列を返す
            return [this.x, this.y, this.r];
        }
    }
}