/// <reference path="surface.ts"/>
module Game {
    export interface ISprite {
        x: number;
        y: number;
        z: number;
        surface: Surface;
        add(group: Group);
        remove(group: Group);
        update();
        kill();
    }
    // UNDONE: 自分の所属しているgroup名の取得
    export class Sprite implements ISprite {
        x: number; // マップ座標
        y: number; // マップ座標
        z: number; // マップ座標
        surface: Surface;
        private _groups: Array<Group>;
        get width(): number {
            return this.surface.width;
        }
        get height(): number {
            return this.surface.height;
        }
        private static default_groups: Array<Group> = [];
        static getDefaultGroups() {
            return Sprite.default_groups;
        }
        static setDefaultGroups(groups: Array<Group>) {
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
        add(group: Group) {
            // グループへの追加はSpriteSystemを経由して行う
            //this.ss.regist(group, this);
            this._groups.push(group);
        }
        remove(group: Group) {
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
        add(sprite: Sprite);
        remove(sprite: Sprite);
        remove_all();
        update();
        draw();
    }
    // TODO: sort
    export class Group implements IGroup{
        screen: Surface;
        private _sprites: Array<Sprite>;
        constructor(screen: Surface) {
            this._sprites = new Array<Sprite>();
            this.screen = screen;
        }
        add(sprite:Sprite) {
            this._sprites.push(sprite);
        }
        remove(sprite: Sprite) {
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
                this.screen.drawSurface(this._sprites[i].surface,this._sprites[i].x,this._sprites[i].y)
            }
        }
    }
}