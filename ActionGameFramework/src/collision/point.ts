module Game {
    export class Point extends AbstractShape {
        x: number;
        y: number;

        get width(): number { return 0; }
        get height(): number { return 0; }

        get left(): number { return this.x; }
        set left(v: number) { this.x = v; }
        get right(): number { return this.x; }
        set right(v: number) { this.x = v; }
        get top(): number { return this.y; }
        set top(v: number) { this.y = v; }
        get bottom(): number { return this.y; }
        set bottom(v: number) { this.y = v; }
        get centerx(): number { return this.x; }
        set centerx(v: number) { this.x = v; }
        get centery(): number { return this.y; }
        set centery(v: number) { this.y = v; }
        constructor(x: number, y: number, base: Point = null) {
            super();
            this.x = x;
            this.y = y;
            if (base) {
                this.x += base.x;
                this.y += base.y;
            }
        }
        getParams(): Array<number> { // constructorに渡すことができる形式でパラメータの配列を返す
            return [this.x, this.y];
        }
    }
}