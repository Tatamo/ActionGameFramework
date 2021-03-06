﻿module Game {
    // ステージマップの役割を持つGroup。
    // 座標からSpriteを取得でき、かつ取得がそこそこ高速であることが期待される。
    // 座標が変化することのないSpriteが登録されるべきである。
    // TODO: 突貫工事で上と左右に番兵をつけているのをどうにかする
    export class MapGroup implements IGroup {
        screen: Surface;
        private _map: Array<Array<ISprite>>;
        private _sprites: Array<ISprite>;
        private _width: number;
        private _height: number;
        private _chipwidth: number;
        private _chipheight: number;
        get chipwidth() { return this._chipwidth; }
        get chipheight() { return this._chipheight }
        constructor(screen: Surface, width: number = 180, height: number = 30, chipwidth: number = 32, chipheight: number = 32) {
            this.screen = screen;
            this._map = new Array<Array<ISprite>>();
            for (var i = 0; i < height + 12; i++) { // _mapの初期化
                this._map.push(new Array<ISprite>());
                for (var ii = 0; ii < width + 2; ii++) {
                    this._map[i].push(null);
                }
            }
            this._sprites = [];
            this._width = width;
            this._height = height;
            this.setChipSize(chipwidth, chipwidth); // 32*32サイズのSpriteを保管 TODO:変更可能に
        }
        setChipSize(width: number, height: number) {
            this._chipwidth = width;
            this._chipheight = height;
        }
        compare(a: ISprite, b: ISprite) { // ソート関数 デフォルトではz座標の逆順ソート
            if (a.z > b.z) {
                return -1; // ここで-1を返しているので逆順のソート
            }
            if (a.z < b.z) {
                return 1;
            }
            return 0;
        }
        add(sprite: ISprite) {
            if (sprite.is_killed) return; // 既にkillされていた場合追加はできない
            var nx = Math.floor(sprite.x / this.chipwidth) + 1;
            var ny = Math.floor(sprite.y / this.chipheight) + 11;
            if (nx < 0 || nx >= this._width + 2 || ny < 0 || ny >= this._height + 12) return; // TODO:もう少しマシにする
            if (!this._map[ny] || !this._map[ny][nx]) {
                this._map[ny][nx] = sprite;
                var i = this._sprites.length - 1;
                while (i >= 0) {
                    if (this.compare(sprite, this._sprites[i]) >= 0) {
                        break;
                    }
                    i -= 1;
                }
                this._sprites.splice(i + 1, 0, sprite);
            }
            else throw new Error("sprite already registered")
        }
        getByXY(nx: number, ny: number): ISprite {
            if (this._map[ny + 11] && this._map[ny + 11][nx + 1]) return this._map[ny + 11][nx + 1];
            else return null;
        }
        getByXYReal(x: number, y: number): ISprite { // 本家正男とは座標がずれていることに注意
            var nx = Math.floor(x / this.chipwidth) + 1;
            var ny = Math.floor(y / this.chipheight) + 11;
            if (this._map[ny] && this._map[ny][nx]) return this._map[ny][nx];
            return null;
        }
        getByRect(nx: number, ny: number, nwidth: number, nheight: number): Array<ISprite> {
            var result = new Array<ISprite>();
            ny = ny + 11;
            nx = nx + 1;
            for (var i = ny; i < ny + nwidth; i++) {
                for (var ii = nx; ii < nx + nheight; ii++) {
                    if (this._map[i] && this._map[i][ii]) result.push(this._map[i][ii]);
                }
            }
            return result;
        }
        getByRectReal(x: number, y: number, width: number, height: number): Array<ISprite> {
            var result = new Array<ISprite>();
            var nx = Math.floor(x / this.chipwidth) + 1;
            var ny = Math.floor(y / this.chipheight) + 11;
            var nx2 = Math.ceil((x + width) / this.chipwidth) + 1;
            var ny2 = Math.ceil((y + height) / this.chipheight) + 11;
            for (var i = ny; i < ny2; i++) {
                for (var ii = nx; ii < nx2; ii++) {
                    if (this._map[i] && this._map[i][ii]) result.push(this._map[i][ii]);
                }
            }
            return result;
        }
        remove(sprite: ISprite) {
            for (var i = 0; i < this._height + 12; i++) {
                for (var ii = 0; ii < this._width + 2; ii++) {
                    if (this._map[i][ii] == sprite) {
                        this._map[i][ii] = null;
                    }
                }
            }
        }
        remove_all() {
            for (var i = 0; i < this._height + 12; i++) {
                for (var ii = 0; ii < this._width + 2; ii++) {
                    if (this._map[i][ii]) this.remove(this._map[i][ii]);
                }
            }
        }
        get_all() {
            return this._sprites.slice(0);
        }
        sort() {
            this._sprites = this._sprites.sort(this.compare);
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
                    if (this._map[i][ii]) this.screen.drawImage(this._map[i][ii].surface, Math.round(this._map[i][ii].x), Math.round(this._map[i][ii].y));
                }
            }
        }
    }
    // マップの管理
    export class MapGenerator {
        private ss: ISpriteSystem;
        private lookup: { [key: string]: any };
        public map: Array<Array<number>>;
        public player: Player;
        constructor(ss: ISpriteSystem) {
            this.setSS(ss);
            this.initLookupTable();
        }
        // to overridden
        private initLookupTable() {
            this.lookup = {};
            this.lookup["A"] = Player;
            this.lookup["B"] = Walker;
            this.lookup["C"] = FallableWalker;
            this.lookup["D"] = ThreeWalkerFallableGenerator;
            this.lookup["E"] = ElectricShooter;
            this.lookup["F"] = LeafShooter;
            this.lookup["G"] = UnStampableWalker;
            this.lookup["H"] = FlierUpDown;
            this.lookup["I"] = Flier;
            this.lookup["J"] = ThreeFlierGenerator;
            this.lookup["O"] = Jumper;
            this.lookup["P"] = FireShooter;
            this.lookup["Q"] = WaterShooter;
            this.lookup["R"] = BomberWithoutReturn;
            this.lookup["a"] = Block1;
            this.lookup["b"] = Block2;
            this.lookup["c"] = Block3;
            this.lookup["d"] = Block4;
            this.lookup["e"] = Block5;
            this.lookup["f"] = Block6;
            this.lookup["1"] = CloudLeft;
            this.lookup["2"] = CloudRight;
            this.lookup["3"] = Grass;
            this.lookup["5"] = UpwardNeedle;
            this.lookup["6"] = DownwardNeedle;
            this.lookup["7"] = Torch;
            this.lookup["8"] = GoalStar;
            this.lookup["9"] = Coin;
        }
        setSS(ss: ISpriteSystem) {
            this.ss = ss;
        }
        // SpriteSystem内にマップを生成します
        // UNDONE:unique Entity(ex:"A")
        generateMap(map: Array<string>, swidth: number, sheight: number, game) {
            for (var i = 0; i < map.length; i += 1) {
                for (var ii = 0; ii < map[i].length; ii += 1) {
                    var e = this.lookup[map[i][ii]];
                    if (e != undefined) {
                        //e(this.ss,swidth,sheight);
                        //new e(this.ss, swidth * ii, sheight * i, game);
                        //console.log(e);
                        if (e != Player) this.ss.add(new e(swidth * ii, sheight * i, game.assets.image, "pattern"));
                        else {
                            this.player = new e(game.gamekey, swidth * ii, sheight * i, game.assets.image, "pattern");
                            this.ss.add(this.player); // この場合より右下のAがplayerとなり本家と挙動が異なる
                        }
                    }
                }
            }
        }
        getEntity(code: string): Function {
            return this.lookup[code];
        }
    }
}