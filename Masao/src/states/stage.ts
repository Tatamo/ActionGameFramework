module Game {
    export module States {
        export class Player extends Sprite {
            constructor(x: number, y: number, imagemanager: ImageManager, label: string, code: number = 0, dx: number = 1, dy: number = 1) {
                super(x, y, imagemanager, label, code, dx, dy);
            }
        }
        export class Stage extends AbstractState {
            player: Player;
            sprites: Group;
            x: number = 0;
            constructor(name: string, sm: StateMachine) {
                super(name, sm);
                this.player = new Player(224, 120, this.sm.game.assets.image, "pattern", 100);
                this.sprites = new Group(this.sm.game.screen);
                this.sprites.add(this.player);
            }
            enter() {
                console.log(this.name);
            }
            update() {
                // 背景色で埋めてみる
                this.sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                this.sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.sprites.draw();

                // うごく
                if (this.sm.game.gamekey.isDown(39)) {
                    this.player.x += 8;
                }
                if (this.sm.game.gamekey.isDown(37)) {
                    this.player.x -= 8;
                }

                if (this.sm.game.gamekey.isOnDown(80)) { // Pキー
                    this.sm.push(new Pause(this.name + "-pause", this.sm)); // ポーズ
                }
                if (this.sm.game.gamekey.isOnDown(84)) { // T
                    this.sm.pop(); // タイトルに戻る
                }
            }
        }
    }
}