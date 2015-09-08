/// <reference path="collision.ts"/>
module Game {
    export interface IShape {
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        width: number;
        height: number;
        getParams();
        collision(target: IShape, exclude_bounds: boolean);
    }
    export class AbstractShape extends Collision implements IShape {
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        width: number;
        height: number;
        constructor() {
            super();
        }
        getParams() { }
    }
}