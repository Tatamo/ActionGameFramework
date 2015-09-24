/// <reference path="enemy.ts"/>
module Game {
    export class UnStampableWalker extends AbstractEnemy {
        constructor(x: number, y: number, imagemanager: ImageManager, label: string) {
            super(x, y, imagemanager, label, 1, 1);
            this.moving = new EntityStateMachine(this);
            this.moving.push(new States.UnStampableWalkerWalking());
        }
    }
    export module States {
        export class UnStampableWalkerWalking extends AbstractState {
            enter(sm: EntityStateMachine) {
            }
            update(sm: EntityStateMachine) {
                var e = sm.e;
                e.counter["ac"] = (e.counter["ac"] + 1) % 4;
                if (e.counter["ac"] < 2) e.code = 152;
                else e.code = 153;

                e.vx = e.reverse_horizontal ? 40 : -40;

                if (e.ss.MapBlocks.getByXYReal((e.reverse_horizontal ? e.right : e.x) + e.vx / 10, e.y + e.height + 1) == null) {
                    e.reverse_horizontal = !e.reverse_horizontal;
                    e.x = e.ss.MapBlocks.getByXYReal(e.centerx, e.y + e.height + 1).x;
                    e.vx = 0;
                }
                this.checkCollisionWithPlayer(sm);
            }
            // プレイヤーとの当たり判定 をプレイヤーのupdate処理に追加する
            // 現時点ではプレイヤーと敵双方のサイズが32*32であることしか想定していない
            checkCollisionWithPlayer(sm: EntityStateMachine) {
                var e = sm.e;
                var players = <Array<Player>>sm.e.ss.Players.get_all();
                for (var i = 0; i < players.length; i++) {
                    var p = players[i];
                    // 現在のpをスコープに束縛
                    ((p: Player) => {
                        p.addOnceEventHandler("update",() => {
                            var dx = Math.abs(e.x - p.x); // プレイヤーとのx座標の差
                            var dy = Math.abs(e.y - p.y); // プレイヤーとのy座標の差
                            if (p.flags["isAlive"] && dx < 30 && dy < 23) { // プレイヤーと接触した
                                // プレイヤーにダメージ
                                p.dispatchEvent(new PlayerMissEvent("miss", 1));
                            }
                        });
                    })(p);
                }
            }
        }
    }
} 