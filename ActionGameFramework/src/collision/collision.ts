module Game {
    export class Collision {
        constructor() {
        }
        public collision(target: IShape, exclude_bounds: boolean = false): boolean {
            var base = <AbstractShape>this; // 自身がShapeクラスに継承されていることを前提とする

            var flag_failed = false;
            if (base instanceof Point) {
                if (target instanceof Point) {
                    return this.colPointWithPoint(base, target, exclude_bounds);
                }
                else if (target instanceof Rect) {
                    return this.colPointWithRect(base, target, exclude_bounds);
                }
                else if (target instanceof Circle) {
                    return this.colPointWithCircle(base, target, exclude_bounds);
                }
                else {
                    flag_failed = true;
                }
            }
            else if (base instanceof Rect) {
                if (target instanceof Point) {
                    return this.colPointWithRect(target, base, exclude_bounds);
                }
                else if (target instanceof Rect) {
                    return this.colRectWithRect(base, target, exclude_bounds);
                }
                else if (target instanceof Circle) {
                    return this.colRectWithCircle(base, target, exclude_bounds);
                }
                else {
                    flag_failed = true;
                }
            }
            else if (base instanceof Circle) {
                if (target instanceof Point) {
                    return this.colPointWithCircle(target, base, exclude_bounds);
                }
                else if (target instanceof Rect) {
                    return this.colRectWithCircle(target, base, exclude_bounds);
                }
                else if (target instanceof Circle) {
                    return this.colCircleWithCircle(base, target, exclude_bounds);
                }
                else {
                    flag_failed = true;
                }
            }
            else {
                flag_failed = true;
            }
            if (flag_failed) throw new Error("incorrect or not supported collision type");
            return false;
        }
        protected colPointWithPoint(p1: Point, p2: Point, exclude_bounds: boolean = false): boolean {
            if (exclude_bounds) {
                if (p1.x == p2.x && p1.y == p2.y) {
                    return true;
                }
            }
            else {
                if (p1.x == p2.x && p1.y == p2.y) {
                    return true;
                }
            }
            return false;
        }
        protected colPointWithRect(p: Point, r: Rect, exclude_bounds: boolean = false): boolean {
            if (exclude_bounds) {
                if (r.left < p.x && p.x < r.right &&
                    r.top < p.y && p.y < r.bottom) {
                    return true;
                }
            }
            else {
                if (r.left <= p.x && p.x <= r.right &&
                    r.top <= p.y && p.y <= r.bottom) {
                    return true;
                }
            }
            return false;
        }
        protected colPointWithCircle(p: Point, c: Circle, exclude_bounds: boolean = false): boolean {
            if (exclude_bounds) {
                if ((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y) < c.r * c.r) {
                    return true;
                }
            }
            else {
                if ((p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y) <= c.r * c.r) {
                    return true;
                }
            }
            return false;
        }
        protected colRectWithRect(r1: Rect, r2: Rect, exclude_bounds: boolean = false): boolean {
            if (exclude_bounds) {
                if (r1.left < r2.right && r2.left < r1.right &&
                    r1.top < r2.bottom && r2.top < r1.bottom) {
                    return true;
                }
            }
            else {
                if (r1.left <= r2.right && r2.left <= r1.right &&
                    r1.top <= r2.bottom && r2.top <= r1.bottom) {
                    return true;
                }
            }
            return false;
        }
        protected colRectWithCircle(r: Rect, c: Circle, exclude_bounds: boolean = false): boolean { // 未実装
            if (exclude_bounds) {
            }
            else {
            }
            return false;
        }
        protected colCircleWithCircle(c1: Circle, c2: Circle, exclude_bounds: boolean = false): boolean {
            if (exclude_bounds) {
                if ((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y) < (c1.r + c2.r) * (c1.r + c2.r)) {
                    return false;
                }
            }
            else {
                if ((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y) <= (c1.r + c2.r) * (c1.r + c2.r)) {
                    return false;
                }
            }
            return false;
        }
    }
}