module Game {
    // ステージマップの役割を持つGroup。
    // 座標からSpriteを取得でき、かつ取得がそこそこ高速であることが期待される。
    // 座標が変化することのないSpriteが登録されるべきである。
    export class MapGroup implements IGroup {
        screen: Surface;
        private _map: Array<Array<ISprite>>;
        private _width: number;
        private _height: number;
        private _chipwidth: number;
        private _chipheight: number;
        get chipwidth() { return this._chipwidth; }
        get chipheight() { return this._chipheight }
        constructor(screen: Surface, width: number = 180, height: number = 30, chipwidth: number = 32, chipheight: number = 32) {
            this.screen = screen;
            this._map = new Array<Array<ISprite>>();
            for (var i = 0; i < height; i++) { // _mapの初期化
                this._map.push(new Array<ISprite>());
                for (var ii = 0; ii < width; ii++) {
                    this._map[i].push(null);
                }
            }
            this._width = width;
            this._height = height;
            this.setChipSize(chipwidth, chipwidth); // 32*32サイズのSpriteを保管 TODO:変更可能に
        }
        setChipSize(width: number, height: number) {
            this._chipwidth = width;
            this._chipheight = height;
        }
        add(sprite: ISprite) {
            var nx = Math.floor(sprite.x / this.chipwidth);
            var ny = Math.floor(sprite.y / this.chipheight);
            if (!this._map[ny] || !this._map[ny][nx]) this._map[ny][nx] = sprite;
            else throw new Error("sprite already registered")
        }
        getByXY(nx: number, ny: number): ISprite {
            if (this._map[ny] && this._map[ny][nx]) return this._map[ny][nx];
            else return null;
        }
        getByXYReal(x: number, y: number): ISprite { // 本家正男とは座標がずれていることに注意
            var nx = Math.floor(x / this.chipwidth);
            var ny = Math.floor(y / this.chipheight);
            if (this._map[ny] && this._map[ny][nx]) return this._map[ny][nx];
            return null;
        }
        getByRect(nx: number, ny: number, nwidth: number, nheight: number): Array<ISprite> {
            var result = new Array<ISprite>();
            for (var i = ny; i < ny + nwidth; i++) {
                for (var ii = nx; ii < nx + nheight; ii++) {
                    if (this._map[i] && this._map[i][ii]) result.push(this._map[i][ii]);
                }
            }
            return result;
        }
        getByRectReal(x: number, y: number, width: number, height: number): Array<ISprite> {
            var result = new Array<ISprite>();
            var nx = Math.floor(x / this.chipwidth);
            var ny = Math.floor(y / this.chipheight);
            var nx2 = Math.ceil((x + width) / this.chipwidth)
            var ny2 = Math.ceil((y + height) / this.chipheight)
            for (var i = ny; i < ny2; i++) {
                for (var ii = nx; ii < nx2; ii++) {
                    if (this._map[i] && this._map[i][ii]) result.push(this._map[i][ii]);
                }
            }
            return result;
        }
        remove(sprite: ISprite) {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii] == sprite) {
                        this._map[i][ii] = null;
                    }
                }
            }
        }
        remove_all() {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii]) this.remove(this._map[i][ii]);
                }
            }
        }
        update() {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii]) this._map[i][ii].update();
                }
            }
        }
        draw() {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii]) this.screen.drawSurface(this._map[i][ii].surface, Math.round(this._map[i][ii].x), Math.round(this._map[i][ii].y));
                }
            }
        }
    }
}