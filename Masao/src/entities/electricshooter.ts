﻿/// <reference path="enemy.ts"/>
module Game {
    export class ElectricShooter extends Enemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.ElectricShooterWaiting());
            //this.code = 140;
            this.addEventHandler("onstamped", this.onStamped);
            //this.addEventHandler("onhit", this.onHit);
        }
        private onStamped(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) this.moving.replace(new States.ElectricShooterStamped());
            this.vx = 0;
            this.vy = 0;
        }
        /*private onHit(e: SpriteCollisionEvent) {
            if (this.flags["isAlive"]) {
                if (e.dir == "horizontal") {
                    this.reverse_horizontal = !this.reverse_horizontal;
                }
                if (e.dir == "vertical") {
                    this.flags["isOnGround"] = true;
                }
            }
        }*/
    }
    export module States {
        export class ElectricShooterWaiting extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.vx = 0;
                e.vy = 0;
                e.code = 143;

                var players = <Array<Player>>sm.e.ss.Players.get_all();

                if (e.counter["ac"] <= 0) { // カウンターが0以下のときのみプレイヤーを探索
                    var flg = false;
                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (p.x >= e.x - 241 && p.x <= e.x + 241) { // x座標の差が241以下のプレイヤーを探す
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        e.counter["ac"] = 0;
                        e.vy = -140 + 10;
                        sm.replace(new ElectricShooterJumping());
                    }
                }
                else {
                    e.counter["ac"] -= 1;
                }

                var pt: Player = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) { // よりx座標が近いなら
                        pt = p;
                    }
                }
                if (pt != null) {
                    if (e.x + 8 >= pt.x) e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else e.reverse_horizontal = true;
                }

                this.checkCollisionWithPlayer(sm);
            }
        }
        export class ElectricShooterJumping extends AbstractStampableAlive {
            enter(sm: EntityStateMachine) {
                sm.e.flags["isOnGround"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.vy += 10; // y速度加算
                if (e.vy > 140) e.vy = 140;

                if (e.vy <= -10) { // y速度に応じて画像を変更
                    e.code = 144;
                }
                else {
                    e.code = 145;
                }

                var players = <Array<Player>>sm.e.ss.Players.get_all();
                var pt: Player = null; // 最も近いプレイヤー
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    if (pt == null) {
                        pt = p;
                    }
                    else if (Math.abs(p.x - e.x) < Math.abs(pt.x - e.x)) { // よりx座標が近いなら
                        pt = p;
                    }
                }

                if (e.vy == 0 && pt != null && (Math.abs(pt.x - e.x) > 32 || e.y <= pt.y)) {
                    // 攻撃
                    var attack = new ElectricShot(pt,e.x, e.y, e.imagemanager, e.label);
                    e.ss.add(attack);
                    attack.update();
                }

                if (pt != null) {
                    if (e.x + 8 >= pt.x) e.reverse_horizontal = false; // 最も近いプレイヤーに合わせて反転状態を決定
                    else e.reverse_horizontal = true;
                }

                if (e.flags["isOnGround"]) {
                    e.counter["ac"] = 30;
                    sm.replace(new ElectricShooterWaiting());
                    sm.update();
                }
                this.checkCollisionWithPlayer(sm);
            }
        }
        export class ElectricShooterStamped extends AbstractState {
            enter(sm: EntityStateMachine) {
                sm.e.counter["ac"] = 0;
                sm.e.code = 146;
                sm.e.flags["isAlive"] = false;
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] += 1;
                e.code = 146;
                e.vx = 0;
                e.vy = 0;
                if (e.counter["ac"] >= 10) {
                    e.kill();
                }
            }
        }
    }
    export class ElectricShot extends Entity {
        constructor(target: ISprite, x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.z = 256; // 敵と同じだけど、どうせ敵より後に生成されるはず
            this.counter["ac"] = 0;
            this.flags["isAlive"] = true;
            this.code = 120;
            /*
            var players = <Array<Player>>this.ss.Players.get_all();
            var pt: Player = null; // 最も近いプレイヤー
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (pt == null) {
                    pt = p;
                }
                else if (Math.abs(p.x - this.x) < Math.abs(pt.x - this.x)) { // よりx座標が近いなら
                    if (Math.abs(p.x - this.x) > 32 || this.y <= p.y) { // 攻撃対象となる条件を満たしているなら
                        pt = p;
                    }
                }
            }
            if (pt == null) {
                this.kill();
            }
            else { // ターゲットとなるプレイヤーが決定

            }*/
            var dx = target.x - this.x;
            var dy = target.y - this.y;
            var r = Math.floor(Math.sqrt(dx * dx + dy * dy));
            if (r < 48) { // 近すぎ
                this.flags["isAlive"] = false;
                return;
            }
            this.vx = Math.floor(14 * dx / r) * 10;
            this.vy = Math.floor(14 * dy / r) * 10;
            this.x += Math.floor(this.vx * 16 / 140);
            this.y += Math.floor(this.vy * 16 / 140);
            console.log(this.x, this.y);
            // 水で消える設定の時の判定はここに書く

        }
        update() {
            if (!this.flags["isAlive"]) {
                this.kill();
                return;
            }
            this.x += Math.floor(this.vx / 10);
            this.y += Math.floor(this.vy / 10);
            this.counter["ac"] = (this.counter["ac"] + 1) % 2;
            if (this.counter["ac"] == 0) this.code = 120;
            else this.code = 121;

            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                var bc = b.getCollision();

                // ブロックと衝突したら消失
                if (new Point(this.centerx, this.centery - 3).collision(bc) || new Point(this.centerx, this.centery + 3).collision(bc)) { // 中心よりやや上下の点で判定
                    this.flags["isAlive"] = false;
                    this.kill();
                    return;
                }

            }
            // スクロール範囲外に出ていたら消失
            var players = <Array<Player>>this.ss.Players.get_all();
            var flg = false;
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (this.x >= p.view_x - this.width && this.x <= p.view_x + SCREEN_WIDTH + this.width * 4 &&
                    this.y >= p.view_y - this.width - SCREEN_HEIGHT / 2 && this.y <= p.view_y + SCREEN_HEIGHT) {
                    flg = true;
                    break;
                }
            }
            if (!flg) {
                this.flags["isAlive"] = false;
                return;
            }
            this.checkCollisionWithPlayer();
        }
        // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
        // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
        checkCollisionWithPlayer() {
            var players = <Array<Player>>this.ss.Players.get_all();
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                // 現在のpをスコープに束縛
                ((p: Player) => {
                    p.addOnceEventHandler("update",() => {
                        var dx = Math.abs(this.x - p.x); // プレイヤーとのx座標の差
                        var dy = Math.abs(this.y - p.y); // プレイヤーとのy座標の差
                        if (p.flags["isAlive"] && dx <= 23 && dy <= 28) { // プレイヤーと接触した
                            // TODO:バリア判定はここに書く
                            // プレイヤーにダメージ
                            p.dispatchEvent(new PlayerMissEvent("miss", 2));
                            //this.kill();
                        }
                    });
                })(p);
            }
        }
    }
}