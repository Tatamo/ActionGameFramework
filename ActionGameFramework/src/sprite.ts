/// <reference path="surface.ts"/>
module Game {
    export interface ISprite extends IEventDispatcher {
        x: number;
        y: number;
        z: number;
        vx: number;
        vy: number;
        width: number;
        height: number;
        code: number;
        reverse_horizontal: boolean;
        reverse_vertical: boolean;
        left: number;
        right: number;
        top: number;
        bottom: number;
        centerx: number;
        centery: number;
        ss: ISpriteSystem;
        is_killed: boolean;
        surface: Surface;
        update();
        kill();
        getRect(): Rect;
        getCollision(): IShape;
    }
    // UNDONE: 自分の所属しているgroup名の取得
    // パターン画像を使用するスプライト
    export class Sprite extends EventDispatcher implements ISprite {
        x: number; // マップ座標
        y: number; // マップ座標
        z: number; // マップ座標
        vx: number;
        vy: number;
        private _ss: ISpriteSystem;
        private _killed: boolean;
        get ss(): ISpriteSystem {
            return this._ss;
        }
        set ss(ss: ISpriteSystem) {
            if (!this.is_killed) this._ss = ss;
            else {
                ss.remove(this);
            }
        }
        get is_killed(): boolean {
            return this._killed;
        }
        surface: PatternSurface;
        get width(): number {
            return this.surface.width;
        }
        get height(): number {
            return this.surface.height;
        }
        get code(): number {
            return this.surface.code;
        }
        set code(c: number) {
            this.surface.code = c;
        }
        get reverse_horizontal(): boolean { return this.surface.reverse_horizontal; }
        set reverse_horizontal(f: boolean) { this.surface.reverse_horizontal = f; }
        get reverse_vertical(): boolean { return this.surface.reverse_vertical; }
        set reverse_vertical(f: boolean) { this.surface.reverse_vertical = f; }
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

        constructor(x: number, y: number, public imagemanager: ImageManager, public label: string, code: number = 0, dx: number = 1, dy: number = 1) {
            super();
            this.addEventHandler("update", this.update);

            this.x = x;
            this.y = y;
            this.z = 0;

            this.vx = 0;
            this.vy = 0;

            this.ss = null;
            this.surface = new PatternSurface(imagemanager, label, code, dx, dy);
            this._killed = false;
        }
        /*// Surfaceの初期化
        setsurface(screen: Surface) {
        }*/
        /*// 自身をグループに追加する
        add(group: IGroup) {
            // グループへの追加はSpriteSystemを経由して行う
            //this.ss.regist(group, this);
            this._groups.push(group);
        }
        remove(group: IGroup) {
            var f: boolean = false;
            for (var i = this._groups.length - 1; i >= 0; i--) {
                if (this._groups[i] == group) {
                    this._groups.splice(i, 1);
                    f = true;
                }
            }
            if (f) group.remove(this); // 相互に参照を破棄
        }*/
        update() {
        }
        kill() {
            this.dispatchEvent(new Event("killed"));
            if (this.ss) this.ss.remove(this);
            this._killed = true;
        }
        getRect(): Rect {
            return new Rect(this.x, this.y, this.width, this.height);
        }
        getCollision(): IShape { // 通常時に当たり判定に使用する図形を得る
            return this.getRect();
        }
    }
    export class SpriteEvent extends Event {
        constructor(public type: string, public sprite: ISprite) {
            super(type);
        }
    }
    export interface IGroup {
        screen: Surface;
        add(sprite: ISprite);
        remove(sprite: ISprite);
        remove_all();
        sort();
        compare(a: ISprite, b: ISprite);
        get_all(): Array<ISprite>;
        update();
        draw();
    }
    // TODO: sort
    export class Group implements IGroup {
        screen: Surface;
        private _sprites: Array<ISprite>;
        constructor(screen: Surface) {
            this._sprites = new Array<ISprite>();
            this.screen = screen;
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
        add(sprite: ISprite) { // ソート方法に沿って要素を追加 比較対象の要素が同じ場合、新しいものは後ろに追加する
            if (sprite.is_killed) return; // 既にkillされていた場合追加はできない
            var i = this._sprites.length - 1;
            while (i >= 0) {
                if (this.compare(sprite, this._sprites[i]) >= 0) {
                    break;
                }
                i -= 1;
            }
            this._sprites.splice(i + 1, 0, sprite);
        }
        remove(sprite: ISprite) {
            //var f: boolean = false; //削除に成功したかどうか判定するフラグ もう使わないか
            for (var i = this._sprites.length - 1; i >= 0; i--) {
                if (this._sprites[i] == sprite) {
                    this._sprites.splice(i, 1);
                    //f = true;
                }
            }
        }
        remove_all() {
            for (var i = this._sprites.length - 1; i >= 0; i--) {
                this.remove(this._sprites[i]);
            }
        }
        get_all(): Array<ISprite> {
            return this._sprites.slice(0);
        }
        sort() {
            this._sprites = this._sprites.sort(this.compare);
        }
        update() {
            // 処理中にthis._spritesの要素が変化する可能性があるため、配列のコピーを回す
            var sps = this._sprites.slice(0);
            for (var i = 0; i < sps.length; i++) {
                //for (var i = sps.length-1; i >= 0; i--) {
                sps[i].dispatchEvent(new Event("update"));
            }
        }
        draw(view_x: number = 0, view_y: number = 0) {
            // 補正 ハードコーディング
            if (view_x < 0) view_x = 0;
            if (view_y < 0) view_y = 0;
            if (view_x > 32 * 180 - 512) view_x = 32 * 180 - 512;
            if (view_y > 32 * 30 - 320) view_y = 32 * 30 - 320;
            for (var i = 0; i < this._sprites.length; i++) {
                this.screen.drawSurface(this._sprites[i].surface, Math.round(this._sprites[i].x) - view_x, Math.round(this._sprites[i].y - view_y));
            }
        }
    }
}