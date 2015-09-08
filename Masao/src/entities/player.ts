/// <reference path="entity.ts"/>
module Game {
    export class Player extends Entity {
        public gk: GameKey; // TODO:疎結合に
        public sjump_effects: Array<PlayerSuperJumpEffect>;
        public moving: PlayerStateMachine;
        public special: PlayerStateMachine;
        constructor(input: GameKey, x: number, y: number, public imagemanager: ImageManager, public label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, dx, dy);
            this.code = 100;
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.setGlobalState(new States.PlayerGlobalMove());
            this.moving.push(new States.PlayerInterialMove());
            this.special = new PlayerStateMachine(this);
            this.special.push(new States.PlayerWithoutSpecialMove());
            this.counter["able2runningLeft"] = 0;
            this.counter["able2runningRight"] = 0;
            this.counter["running"] = 0;
            this.counter["jump_level"] = 0;
            this.counter["stamp_waiting"] = 0;
            this.counter["dying"] = 0;
            this.counter["superjump_effect"] = -1;
            this.flags["isAlive"] = true; // まだミスをしていない状態
            this.flags["isRunning"] = false; // 走っている状態
            this.flags["isWalking"] = false; // 歩いている状態
            this.flags["isJumping"] = true; // ジャンプによって空中にいる状態
            this.flags["isStamping"] = false; // 敵を踏んだ状態
            this.flags["isOnGround"] = false; // 地面の上にいる状態
            this.sjump_effects = [];
            this.reverse_horizontal = true;
            this.z = 128;
            this.addEventHandler("onground", this.onGround);
            this.addEventHandler("onstamp", this.onStamp);
            this.addEventHandler("miss", this.onMiss);
        }
        public get alive(): boolean {
            return this.flags["isAlive"];
        }
        private onGround(e: Event) {
            this.flags["isOnGround"] = true;
            this.flags["isJumping"] = false;
            this.flags["isStamping"] = false;
            this.counter["jump_level"] = 0;
            if (this.counter["superjump_effect"] >= 0) this.counter["superjump_effect"] = 100;
        }
        private onStamp(e: Event) {
            this.moving.push(new States.PlayerStamping());
        }
        private onMiss(e: PlayerMissEvent) {
            this.dispatchEvent(new Event("onground")); // ほぼスーパージャンプのエフェクトを消すためだけ
            if (e.mode == 1) {
                this.moving.replace(new States.PlayerDyingDirect());
            }
            else if (e.mode == 2) {
                this.moving.replace(new States.PlayerDyingInDirect());
            }
        }
        update() {
            if (this.flags["isAlive"]) {
                // 入力の更新
                this.checkInput();
                //this.externalForce();

                // 外力を受けない移動
                this.moving.update();
                this.special.update();
                // 移動の確定
                if (this.counter["stamp_waiting"] <= 0) this.move();
                else this.counter["stamp_waiting"] -= 1;

                this.fixPatternCode();
                //this.x = Math.floor(this.x);
                //this.y = Math.floor(this.y);
            }
            else {
                this.moving.update();
                this.x += this.vx / 10;
                this.y += this.vy > -320 ? this.vy / 10 : -32;
            }
        }
        // 速度に応じて自機の座標を移動させる
        private move() {
            var muki_x = 0;
            if (this.vx > 0) muki_x = 1;
            else if (this.vx < 0) muki_x = -1;
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定

            var tmp_bottom = this.bottom;
            var tmp_top = this.top;
            this.y += this.vy > -320 ? this.vy / 10 : -32;
            this.checkCollisionWithBlocksVertical(); // 接触判定

            // 補正
            if (this.vy > 0) { // 下降中
                if (tmp_bottom < this.bottom) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_bottom + 1) == null) { // 移動前 自機の足元にブロックが無い
                        if (this.getHitBlock(this.centerx + muki_x, this.bottom + 1) != null) { // 移動後 自機の足元にブロックがある
                            if (this.flags["isWalking"] || this.flags["isRunning"]) this.x += muki_x; // トンネルに入れるようにする
                            this.checkCollisionWithBlocksVertical();
                            this.vy = 0;
                            //_ptc = 103;
                            this.counter["running"] = 1;
                        }
                    }
                }
            }
            else if (this.vy < 0) { // 上昇中
                if (tmp_top > this.top) {
                    if (this.getHitBlock(this.centerx + muki_x, tmp_top) == null) { // 移動前 自機の頭にブロックが無い
                        if (this.getHitBlock(this.centerx + muki_x, this.top) != null) { // 移動後 自機の頭にブロックがある
                            if (this.flags["isWalking"] || this.flags["isRunning"]) this.x += muki_x; // トンネルに入れるようにする
                            this.checkCollisionWithBlocksVertical();
                            this.vy = 0;
                            //_ptc = 103;
                            this.counter["running"] = 1;
                        }
                    }
                }
            }
        }
        private fixPatternCode() {
            if (this.flags["isStamping"]) {
                this.code = 109;
            }
            else {
                if (this.flags["isOnGround"]) { // 地上にいる
                }
                else {
                    if (this.flags["isJumping"]) { // ジャンプ中のパターン画像
                        if (this.vy <= 25) this.code = 101;
                        else this.code = 102;
                    }
                    else {
                        if (this.vx == 0 && !this.flags["isRunning"] && !this.flags["isWalking"]) { // 立ち止まった状態で落下
                            this.code = 100;
                        }
                        else if (Math.abs(this.vx) > 60) {
                            this.code = 105;
                        }
                        else {
                            this.code = 103;
                        }
                    }
                }
            }
        }
        checkCollisionWithBlocksVertical() {
            this.flags["isOnGround"] = false;
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "vertical", "center"));
                }
            }
        }
        checkCollisionWithBlocksHorizontal() {
            // check
            var blocks = this.ss.getBlocks(this.x, this.y, this.width, this.height);

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal", "center"));
                }
            }
        }
        // 指定した座標地点にブロックがある場合、そのブロックを返す。
        // そうでない場合、nullを返す。
        getHitBlock(x: number, y: number): ISprite {
            var b: ISprite = this.ss.getBlock(x, y);
            if (b) return b;
            return null;
        }
        checkInput() {
            //if (this.gk.isDown(37) && this.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
            if (this.gk.isDown(37)) {
                if (this.gk.isOnDown(37) && this.counter["able2runningLeft"] > 0) {
                    this.moving.replace(new States.PlayerRunningLeft());
                    //this.flags["isRunning"] = true;
                }
                else if (!(this.moving.current_state instanceof States.PlayerRunningLeft)) {
                    this.moving.replace(new States.PlayerWalkingLeft());
                }
            }
            else if (this.gk.isDown(39)) {
                if (this.gk.isOnDown(39) && this.counter["able2runningRight"] > 0) {
                    this.moving.replace(new States.PlayerRunningRight());
                }
                else if (!(this.moving.current_state instanceof States.PlayerRunningRight)) {
                    this.moving.replace(new States.PlayerWalkingRight());
                }
            }
            if ((!this.gk.isDown(37) && !this.gk.isDown(39)) ||
                ((this.moving.current_state instanceof States.PlayerWalkingLeft) && !this.gk.isDown(37)) ||
                ((this.moving.current_state instanceof States.PlayerWalkingRight) && !this.gk.isDown(39)) ||
                ((this.moving.current_state instanceof States.PlayerRunningLeft) && !this.gk.isDown(37)) ||
                ((this.moving.current_state instanceof States.PlayerRunningRight) && !this.gk.isDown(39))) {
                this.moving.replace(new States.PlayerInterialMove());
            }

            if (this.counter["able2runningLeft"] >= 8) this.counter["able2runningLeft"] = 0;
            else if (this.counter["able2runningLeft"] > 0) this.counter["able2runningLeft"] += 1;

            if (this.counter["able2runningRight"] >= 8) this.counter["able2runningRight"] = 0;
            else if (this.counter["able2runningRight"] > 0) this.counter["able2runningRight"] += 1;

            if (this.flags["isOnGround"]) { // 地上にいる
                if (this.gk.isDown(90) && this.gk.getCount(90) < 5) { // ジャンプ判定
                    this.moving.push(new States.PlayerJumping());
                }
            }

            if (this.gk.isOnDown(37)) { // ステート遷移判定より後で処理
                this.counter["able2runningLeft"] = 1;
            }
            if (this.gk.isOnDown(39)) {
                this.counter["able2runningRight"] = 1;
            }
        }
    }
    export class PlayerStateMachine extends StateMachine {
        public pl: Player;
        constructor(pl: Player, parent: any = null) {
            super(parent);
            this.pl = pl;
        }
    }
    export class PlayerMissEvent extends Event {
        constructor(public type: string, public mode: number) {
            // mode 1:直接 2:間接
            super(type);
        }
    }
    export module States {
        /*export interface IPlayerMovingState extends State { // 不要説 てか不要
            enter(sm: PlayerStateMachine);
            update(sm: PlayerStateMachine);
            exit(sm: PlayerStateMachine);
        }*/
        // 処理中にジャンプなどに一瞬だけ状態が遷移することで、脈絡なくenterが再度呼ばれる可能性があることに注意
        export class PlayerGlobalMove extends AbstractState {
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.flags["isAlive"]) {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                    }
                    else { // 地上にいない
                        if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                        }
                        else {
                            pl.vy += 25; // 重力を受ける
                            if (pl.vy > 160) pl.vy = 160;
                        }
                    }
                }
                if (pl.counter["superjump_effect"] >= 0) {
                    var del = (s: PlayerSuperJumpEffect) => { if (s) s.kill(); };
                    var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, 1, 1, pl.code, pl.reverse_horizontal);
                    pl.ss.add(effect);
                    pl.sjump_effects.push(effect);
                    del(pl.sjump_effects.shift());
                    if (pl.counter["superjump_effect"] < 9) {
                        pl.counter["superjump_effect"] += 1;
                        if (pl.vy > 0) pl.counter["superjump_effect"] = 9;
                    }
                    else {
                        if (pl.counter["superjump_effect"] >= 100) {
                            pl.counter["superjump_effect"] = -1;
                            while (pl.sjump_effects.length > 0) {
                                del(pl.sjump_effects.shift());
                            }
                        }
                        else if (pl.counter["superjump_effect"] >= 9) {
                            del(pl.sjump_effects.shift());
                            if (pl.sjump_effects.length == 0) {
                                pl.counter["superjump_effect"] = 100;
                            }
                        }
                    }
                }
            }
        }
        export class PlayerWalkingLeft extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("walk left ");
                sm.pl.flags["isRunning"] = false;
                sm.pl.flags["isWalking"] = true;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx - 10 > -60) ? pl.vx - 10 : -60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx - 15 > -60) ? pl.vx - 15 : -60;
                        if (pl.vx > 0) pl.code = 108;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx > -60) pl.vx -= 10;
                    }
                }
            }
        }
        export class PlayerRunningLeft extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("run left ");
                sm.pl.flags["isRunning"] = true;
                sm.pl.flags["isWalking"] = false;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx - 10 > -60) ? pl.vx - 10 : -60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx - 15 > -120) ? pl.vx - 15 : -120;
                        if (pl.vx > 0) pl.code = 108;
                        else pl.code = 105 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx > -60) pl.vx -= 10;
                    }
                }
            }
        }
        export class PlayerWalkingRight extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("walk right ");
                sm.pl.flags["isRunning"] = false;
                sm.pl.flags["isWalking"] = true;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx + 10 < 60) ? pl.vx + 10 : 60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx + 15 < 60) ? pl.vx + 15 : 60;
                        if (pl.vx < 0) pl.code = 108;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx < 60) pl.vx += 10;
                    }
                }
            }
        }
        export class PlayerRunningRight extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("run right ");
                sm.pl.flags["isRunning"] = true;
                sm.pl.flags["isWalking"] = false;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.counter["stamp_waiting"] > 0) { // 硬直中
                    pl.vx = (pl.vx + 10 < 60) ? pl.vx + 10 : 60;
                }
                else {
                    if (pl.flags["isOnGround"]) { // 地上にいる
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        pl.vx = (pl.vx + 15 < 120) ? pl.vx + 15 : 120;
                        if (pl.vx < 0) pl.code = 108;
                        else pl.code = 105 + Math.floor(pl.counter["running"] / 2);
                    }
                    else { // 地上にいない
                        if (pl.vx < 60) pl.vx += 10;
                    }
                }
            }
        }
        export class PlayerJumping extends AbstractState {
            update(sm: PlayerStateMachine) {
                sm.pop(); // 即座にもとのStateに戻す
                sm.update(); // もとのStateのupdateを先に行う
                var pl = sm.pl;
                pl.checkCollisionWithBlocksHorizontal();
                if (pl.counter["stamp_waiting"] > 0) return; // 硬直中
                pl.flags["isJumping"] = true;
                pl.flags["isOnGround"] = false;
                var speed = Math.abs(pl.vx);
                /*// 貫通防止
                if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1).dispatchEvent(new SpriteCollisionEvent("onhit", pl, "vertival"));
                }*/
                if (pl.ss.MapBlocks.getByXYReal(pl.centerx + pl.vx / 10, pl.y - 1) == null || pl.ss.MapBlocks.getByXYReal(pl.centerx, pl.y - 1) == null) {
                    if (speed == 0) {
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed < 60) {
                        if (pl.ss.MapBlocks.getByXYReal(pl.centerx + (pl.vx > 0 ? 1 : -1), pl.centery) != null) { // 斜め床の場合、これでは不十分
                            pl.vy = -150;
                            pl.counter["jump_level"] = 1;
                        }
                        else {
                            pl.vy = -230;
                            pl.counter["jump_level"] = 2;
                        }
                    }
                    else if (speed == 60) {
                        pl.vy = -260;
                        pl.counter["jump_level"] = 3;
                    }
                    else if (speed < 120) {
                        pl.vy = -290;
                        pl.counter["jump_level"] = 4;
                    }
                    else {
                        pl.vy = -340;
                        pl.counter["jump_level"] = 5;
                        pl.counter["superjump_effect"] = 1;
                        var effect = new PlayerSuperJumpEffect(pl.x, pl.y, pl.imagemanager, pl.label, 1, 1, 101, pl.reverse_horizontal);
                        pl.ss.add(effect);
                        pl.sjump_effects=[null,null,null,null,null,effect];
                    }
                }
                pl.checkCollisionWithBlocksVertical();
            }
        }
        export class PlayerInterialMove extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("move interial ");
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.flags["isOnGround"]) { // 地上にいる
                    if (pl.vx < 0) {
                        pl.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        if (pl.flags["isRunning"]) pl.code = 107;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                        //muki_x = false;
                    }
                    else if (pl.vx > 0) {
                        pl.reverse_horizontal = true;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        if (pl.flags["isRunning"]) pl.code = 107;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                        //muki_x = true;
                    }

                    // 摩擦を受ける
                    if (pl.vx > 0) {
                        pl.vx -= 5;
                        if (pl.vx < 0) pl.vx = 0;
                    }
                    else if (pl.vx < 0) {
                        pl.vx += 5;
                        if (pl.vx > 0) pl.vx = 0;
                    }

                    if (pl.vx == 0) {
                        sm.pl.flags["isRunning"] = false;
                        sm.pl.flags["isWalking"] = false;
                        pl.code = 100;
                    }
                }
                else { // 地上にいない
                }
            }
        }
        export class PlayerDyingDirect extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("dying");
                var pl = sm.pl;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                    pl.vy = -250; // 跳ね上がる
                }
                pl.vy += 25; // 重力を受ける
                if (pl.vy > 80) pl.vy = 80;
                pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.y > 320 * 3) {
                    pl.kill();
                    pl.dispatchEvent(new Event("ondie"));
                }
            }
        }
        export class PlayerDyingInDirect extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("dying");
                var pl = sm.pl;
                pl.flags["isAlive"] = false;
                pl.counter["dying"] = 0;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.counter["dying"] == 0) {
                    pl.vx = 0;
                }
                pl.vy = 0; // その場で回転する
                pl.counter["dying"] += 1;
                pl.code = 110 + pl.counter["dying"] % 4;
                if (pl.counter["dying"] >= 16) pl.vy = 80;
                if (pl.y > 320 * 3) {
                    pl.kill();
                    pl.dispatchEvent(new Event("ondie"));
                }
            }
        }
        export class PlayerStamping extends AbstractState {
            private wait: number;
            enter(sm: PlayerStateMachine) {
                console.log("stamping");
                sm.pl.code = 109;
                sm.pl.flags["isStamping"] = true;
                sm.pl.counter["stamp_waiting"] = 5;
                sm.pl.vy = -160;
                //sm.pl.vy = -220;
                if (sm.pl.counter["superjump_effect"] >= 0) sm.pl.counter["superjump_effect"] = 100;
                sm.pop(); // update時ではなくenter直後にもとのstateに戻す
            }
            update(sm: PlayerStateMachine) {
                /*sm.pop();
                sm.update();*/
            }
        }
        export class PlayerWithoutSpecialMove extends AbstractState {
            enter(sm: PlayerStateMachine) {
            }
            update(sm: PlayerStateMachine) {
            }
        }
    }
    export class PlayerSuperJumpEffect extends Sprite {
        public ss: SpriteSystem;
        constructor(x: number, y: number, imagemanager: ImageManager, private label: string, dx: number, dy: number, code: number, reverse_horizontal:boolean) {
            super(x, y, imagemanager, label, 100, dx, dy);
            this.code = code;
            this.z = 129;
            this.reverse_horizontal = reverse_horizontal;
        }
        update() {
        }
    }
}