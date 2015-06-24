/// <reference path="surface.ts"/>
module Game {
    export interface ISprite {
        x: number;
        y: number;
        z: number;
        surface: Surface;
        add(group: IGroup);
        remove(group: IGroup);
        update();
        kill();
    }
    // UNDONE: 自分の所属しているgroup名の取得
    // パターン画像を使用するスプライト
    export class Sprite implements ISprite {
        x: number; // マップ座標
        y: number; // マップ座標
        z: number; // マップ座標
        surface: PatternSurface;
        private _groups: Array<IGroup>;
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
        private static default_groups: Array<IGroup> = [];
        static getDefaultGroups() {
            return Sprite.default_groups;
        }
        static setDefaultGroups(groups: Array<IGroup>) {
            Sprite.default_groups = groups;
        }
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, code: number = 0, dx: number = 1, dy: number = 1) {
            this._groups = new Array<Group>();
            if (Sprite.default_groups) {
                for (var i = 0; i < Sprite.default_groups.length; i++) {
                    Sprite.default_groups[i].add(this);
                }
            }

            this.x = x;
            this.y = y;
            this.z = 0;

            this.surface = new PatternSurface(imagemanager,label,code,dx,dy);
        }
        /*// Surfaceの初期化
        setsurface(screen: Surface) {
        }*/
        // 自身をグループに追加する
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
        }
        update() {
        }
        // 所属しているすべてのグループとの参照を破棄します
        kill() {
            for (var i = this._groups.length - 1; i >= 0; i--) {
                this.remove(this._groups[i]);
            }
        }
    }
    export interface IGroup {
        screen: Surface;
        add(sprite: ISprite);
        remove(sprite: ISprite);
        remove_all();
        update();
        draw();
    }
    // TODO: sort
    export class Group implements IGroup{
        screen: Surface;
        private _sprites: Array<ISprite>;
        constructor(screen: Surface) {
            this._sprites = new Array<ISprite>();
            this.screen = screen;
        }
        add(sprite:ISprite) {
            this._sprites.push(sprite);
        }
        remove(sprite: ISprite) {
            var f: boolean = false;
            for (var i = this._sprites.length - 1; i >= 0; i--) {
                if (this._sprites[i] == sprite) {
                    this._sprites.splice(i, 1);
                    f = true;
                }
            }
            if (f) sprite.remove(this); // 相互に参照を破棄
        }
        remove_all() {
            for (var i = this._sprites.length - 1; i >= 0; i--) {
                this.remove(this._sprites[i]);
            }
        }
        update() {
            // 処理中にthis._spritesの要素が変化する可能性があるため、配列のコピーを回す
            var sps = this._sprites.slice(0);
            for (var i = 0; i < sps.length; i++) {
                sps[i].update();
            }
        }
        draw() {
            for (var i = 0; i < this._sprites.length; i++) {
                this.screen.drawSurface(this._sprites[i].surface,Math.round(this._sprites[i].x),Math.round(this._sprites[i].y));
            }
        }
    }
}