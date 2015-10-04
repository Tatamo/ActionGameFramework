/// <reference path="shape.ts"/>
module Game {
    export class Rect extends AbstractShape {
        x: number;
        y: number;
        width: number;
        height: number;

        get left(): number { return this.x; }
        set left(v: number) { this.x = v; }
        get right(): number { return this.x + this.width; }
        set right(v: number) { this.x = v - this.width; }
        get top(): number { return this.y; }
        set top(v: number) { this.y = v; }
        get bottom(): number { return this.y + this.height; }
        set bottom(v: number) { this.y = v - this.height; }
        get centerx(): number { return this.x + this.width / 2; }
        set centerx(v: number) { this.x = v - this.width / 2; }
        get centery(): number { return this.y + this.height / 2; }
        set centery(v: number) { this.y = v - this.height / 2; }
        constructor(x: number, y: number, w: number, h: number, base: Rect = null) {
            super();
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            if (base) {
                this.x += base.x;
                this.y += base.y;
                this.width += base.width;
                this.height += base.height;
            }
        }
        getParams(): Array<number> { // constructorに渡すことができる形式でパラメータの配列を返す
            return [this.x, this.y, this.width, this.height];
        }
    }
}