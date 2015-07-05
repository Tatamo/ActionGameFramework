module Game {
    // ステージマップの役割を持つGroup。
    // 座標からSpriteを取得でき、かつ取得がそこそこ高速であることが期待される。
    // 座標が変化することのないSpriteが登録されるべきである。
    export class MapGroup implements IGroup {
        screen: Surface;
        private _map: Array<Array<ISprite>>;
        private _xsprites: Array<ISprite>;
        private _width: number;
        private _height: number;
        private _chipwidth: number;
        private _chipheight: number;
        get chipwidth() { return this._chipwidth; }
        get chipheight() { return this._chipheight }
        constructor(screen: Surface, width: number = 180, height: number = 30) {
            this._xsprites = new Array<ISprite>();
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
            this.setChipSize(32, 32); // 32*32サイズのSpriteを保管 TODO:変更可能に
        }
        setChipSize(width: number, height: number) {
            this._chipwidth = width;
            this._chipheight = height;
        }
        add(sprite: ISprite) {
            if (sprite.x % this.chipwidth != 0 || sprite.y % this.chipheight != 0) {
                this._xsprites.push(sprite);
            }
            else {
                var nx = sprite.x / this.chipwidth;
                var ny = sprite.y / this.chipheight;
                if (!this._map[ny] || !this._map[ny][nx]) this._map[ny][nx] = sprite;
                else this._xsprites.push(sprite); // 既に同一座標に登録済みならばEX領域に追加
            }
        }
        getByXY(nx: number, ny: number): ISprite {
            if (this._map[ny] && this._map[ny][nx]) return this._map[ny][nx];
            for (var i = 0; i < this._xsprites.length; i++) {
                var sp = this._xsprites[i];
                if (sp.x == nx*this.chipwidth && sp.y == ny*this.chipheight) return sp;
            }
        }
        getByXYObscure(nx: number, ny: number):Array<ISprite> { // 指定したマスに少しでも接しているSpriteをすべて取得
            var result = new Array<ISprite>();
            if (this._map[ny] && this._map[ny][nx]) result.push(this._map[ny][nx]);
            for (var i = 0; i < this._xsprites.length; i++) {
                var sp = this._xsprites[i];
                if (sp.x <= (nx + 1) * this.chipwidth && sp.x + this.chipwidth >= nx * this.chipwidth &&
                    sp.y <= (ny + 1) * this.chipheight && sp.y + this.chipheight >= ny * this.chipheight) {
                    result.push(sp);
                }
            }
            return result;
        }
        getByXYReal(x: number, y: number):ISprite { // 本家正男とは座標がずれていることに注意
            if (x % this.chipwidth == 0 && y % this.chipheight == 0) {
                var nx = Math.floor(x / this.chipwidth);
                var ny = Math.floor(y / this.chipheight);
                if (this._map[ny] && this._map[ny][nx]) return this._map[ny][nx];
            }
            for (var i = 0; i < this._xsprites.length; i++) {
                var sp = this._xsprites[i];
                if (sp.x == x && sp.y == y) return sp;
            }
            return null;
        }
        remove(sprite: ISprite) {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii] == sprite) {
                        this._map[i][ii] = null;
                    }
                }
            }
            for (var i = this._xsprites.length - 1; i >= 0; i--) {
                if (this._xsprites[i] == sprite) {
                    this._xsprites.splice(i, 1);
                }
            }
        }
        remove_all() {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii]) this.remove(this._map[i][ii]);
                }
            }
            for (var i = this._xsprites.length - 1; i >= 0; i--) {
                this.remove(this._xsprites[i]);
            }
        }
        update() {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii]) this._map[i][ii].update();
                }
            }
            // 処理中にthis._spritesの要素が変化する可能性があるため、配列のコピーを回す
            var sps = this._xsprites.slice(0);
            for (var i = 0; i < sps.length; i++) {
                sps[i].update();
            }
        }
        draw() {
            for (var i = 0; i < this._height; i++) {
                for (var ii = 0; ii < this._width; ii++) {
                    if (this._map[i][ii]) this.screen.drawSurface(this._map[i][ii].surface, Math.round(this._map[i][ii].x), Math.round(this._map[i][ii].y));
                }
            }
            for (var i = 0; i < this._xsprites.length; i++) {
                this.screen.drawSurface(this._xsprites[i].surface, Math.round(this._xsprites[i].x), Math.round(this._xsprites[i].y));
            }
        }
    }
}