module Game {
    export class Player extends Sprite {
        public gk: GameKey; // TODO:疎結合に
        public counter: { [key: string]: number; };
        public flags: { [key: string]: boolean; };
        public moving: PlayerStateMachine;
        public ss: SpriteSystem;
        constructor(input: GameKey, x: number, y: number, imagemanager: ImageManager, label: string, dx: number = 1, dy: number = 1) {
            super(x, y, imagemanager, label, 100, dx, dy);
            this.gk = input;
            this.moving = new PlayerStateMachine(this);
            this.moving.setGlobalState(new States.PlayerGlobalMove());
            this.moving.push(new States.PlayerInterialMove());
            this.counter = {};
            this.counter["able2runningLeft"] = 0;
            this.counter["able2runningRight"] = 0;
            this.counter["running"] = 0;
            this.counter["jump_level"] = 0;
            this.counter["ptc_slippingonair"] = 0;
            this.flags = {};
            this.flags["isRunning"] = false;
            this.flags["isWalking"] = false;
            this.flags["isJumping"] = false;
            this.flags["isOnGround"] = false;
            this.z = 128;
            this.addEventHandler("onground", this.onGround);
        }
        private onGround(e: Event) {
            this.flags["isOnGround"] = true;
            this.flags["isJumping"] = false;
            this.counter["jump_level"] = 0;
        }
        update() {
            // 入力の更新
            this.checkInput();
            //this.externalForce();

            // 外力を受けない移動
            this.moving.update();
            this.x += this.vx / 10;
            this.checkCollisionWithBlocksHorizontal(); // 接触判定
            this.y += this.vy / 10;
            this.checkCollisionWithBlocksVertical(); // 接触判定

            this.fixPatternCode();

        }
        fixPatternCode() {
            if (this.flags["isOnGround"]) { // 地上にいる
            }
            else {
                if (this.flags["isJumping"]) { // ジャンプ中のパターン画像
                    if (this.vy <= 0) this.code = 101;
                    if (this.vy > 0) this.code = 102;
                }
                else { // ジャンプ中ではなく地上にいる
                    if (this.flags["isOnGround"]) {
                        if (this.vx == 0 && !this.flags["isRunning"] && !this.flags["isWalking"]) { // 立ち止まる
                            this.counter["ptc_slippingonair"] = 0;
                        }
                        else if (this.flags["isRunning"]) {
                            this.counter["ptc_slippingonair"] = 105;
                        }
                        else if (this.flags["isWalking"]) {
                            this.counter["ptc_slippingonair"] = 103;
                        }
                    }
                    else { // 滑り落ちる
                        if (this.counter["ptc_slippingonair"] != 0) {
                            this.code = this.counter["ptc_slippingonair"];
                        }
                    }
                }
            }
        }
        checkCollisionWithBlocksVertical() {
            this.flags["isOnGround"] = false;
            // check
            var blocks = this.ss.GetBlocks(this.x, this.y, this.width, this.height + 1); // 足元+1ピクセルも含めて取得

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "vertical"));
                }
            }
        }
        checkCollisionWithBlocksHorizontal() {
            // check
            var blocks = this.ss.GetBlocks(this.x, this.y, this.width, this.height);

            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (this.x <= b.x + b.width && this.x + this.width >= b.x &&
                    this.y <= b.y + b.height && this.y + this.height >= b.y) {
                    b.dispatchEvent(new SpriteCollisionEvent("onhit", this, "horizontal"));
                }
            }
        }
        checkInput() {
            //if (this.gk.isDown(37) && this.gk.isDown(39)) { } // 左右同時に押されていたらとりあえず何もしないことに
            if (this.gk.isOnDown(37)) {
                if (this.counter["able2runningLeft"] > 0) {
                    this.moving.replace(new States.PlayerRunningLeft());
                    //this.flags["isRunning"] = true;
                }
                else if (!(this.moving.CurrentState() instanceof States.PlayerRunningLeft)) {
                    this.moving.replace(new States.PlayerWalkingLeft());
                }
            }
            else if (this.gk.isOnDown(39)) {
                if (this.counter["able2runningRight"] > 0) {
                    this.moving.replace(new States.PlayerRunningRight());
                }
                else if (!(this.moving.CurrentState() instanceof States.PlayerRunningRight)) {
                    this.moving.replace(new States.PlayerWalkingRight());
                }
            }
            if ((!this.gk.isDown(37) && !this.gk.isDown(39)) ||
                ((this.moving.CurrentState() instanceof States.PlayerWalkingLeft) && !this.gk.isDown(37)) ||
                ((this.moving.CurrentState() instanceof States.PlayerWalkingRight) && !this.gk.isDown(39)) ||
                ((this.moving.CurrentState() instanceof States.PlayerRunningLeft) && !this.gk.isDown(37)) ||
                ((this.moving.CurrentState() instanceof States.PlayerRunningRight) && !this.gk.isDown(39))) {
                this.moving.replace(new States.PlayerInterialMove());
            }

            if (this.counter["able2runningLeft"] >= 8) this.counter["able2runningLeft"] = 0;
            else if (this.counter["able2runningLeft"] > 0) this.counter["able2runningLeft"] += 1;

            if (this.counter["able2runningRight"] >= 8) this.counter["able2runningRight"] = 0;
            else if (this.counter["able2runningRight"] > 0) this.counter["able2runningRight"] += 1;


            if (this.gk.isOnDown(37)) { // ステート遷移判定より後で処理
                this.counter["able2runningLeft"] = 1;
            }
            if (this.gk.isOnDown(39)) {
                this.counter["able2runningRight"] = 1;
            }
            if (this.flags["isOnGround"]) { // 地上にいる
                if (this.gk.isDown(90) && this.gk.getCount(90) < 5) {
                    this.moving.push(new States.PlayerJumping());
                }
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
    export module States {
        /*export interface IPlayerMovingState extends State { // 不要説 てか不要
            enter(sm: PlayerStateMachine);
            update(sm: PlayerStateMachine);
            exit(sm: PlayerStateMachine);
        }*/
        // 地上での処理が前提
        // TODO:空中
        export class PlayerGlobalMove extends AbstractState {
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;

                if (pl.flags["isOnGround"]) { // 地上にいる
                }
                else { // 地上にいない
                    pl.vy += 25; // 重力を受ける
                    if (pl.vy > 160) pl.vy = 160;
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
                if (pl.flags["isOnGround"]) { // 地上にいる
                    pl.surface.reverse_horizontal = false;
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
        export class PlayerRunningLeft extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("run left ");
                sm.pl.flags["isRunning"] = true;
                sm.pl.flags["isWalking"] = false;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.flags["isOnGround"]) { // 地上にいる
                    pl.surface.reverse_horizontal = false;
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
        export class PlayerWalkingRight extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("walk right ");
                sm.pl.flags["isRunning"] = false;
                sm.pl.flags["isWalking"] = true;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.flags["isOnGround"]) { // 地上にいる
                    pl.surface.reverse_horizontal = true;
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
        export class PlayerRunningRight extends AbstractState {
            enter(sm: PlayerStateMachine) {
                console.log("run right ");
                sm.pl.flags["isRunning"] = true;
                sm.pl.flags["isWalking"] = false;
            }
            update(sm: PlayerStateMachine) {
                var pl = sm.pl;
                if (pl.flags["isOnGround"]) { // 地上にいる
                    pl.surface.reverse_horizontal = true;
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
        export class PlayerJumping extends AbstractState {
            enter(sm: PlayerStateMachine) {
                var pl = sm.pl;
                pl.flags["isJumping"] = true;
                pl.flags["isOnGround"] = false;
                var speed = Math.abs(pl.vx);
                // 貫通防止
                if (pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2, pl.y - 1).dispatchEvent(new SpriteCollisionEvent("onhit", pl, "vertical"));
                }
                else if (pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2 + pl.vx / 10, pl.y - 1) != null) {
                    pl.ss.MapBlocks.getByXYReal(pl.x + pl.width / 2 + pl.vx / 10, pl.y - 1).dispatchEvent(new SpriteCollisionEvent("onhit", pl, "vertival"));
                }
                else {
                    if (speed == 0) {
                        pl.vy = -150;
                        pl.counter["jump_level"] = 1;
                    }
                    else if (speed < 60) {
                        pl.vy = -230;
                        pl.counter["jump_level"] = 2;
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
                    }
                }
                pl.checkCollisionWithBlocksVertical();
                sm.pop(); // 即座にもとのStateに戻す
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
                        pl.surface.reverse_horizontal = false;
                        pl.counter["running"]++;
                        if (pl.counter["running"] > 3) pl.counter["running"] = 0;
                        if (pl.flags["isRunning"]) pl.code = 107;
                        else pl.code = 103 + Math.floor(pl.counter["running"] / 2);
                        //muki_x = false;
                    }
                    else if (pl.vx > 0) {
                        pl.surface.reverse_horizontal = true;
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
    }
}