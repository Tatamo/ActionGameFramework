module Game {
    export module States {
        export class Stage extends AbstractState {
            player: Player;
            sprites: Group;
            gk: GameKey;
            constructor(name: string, sm: StateMachine) {
                super(name, sm);
                this.gk = this.sm.game.gamekey;
                this.player = new Player(this.gk, 224, 120, this.sm.game.assets.image, "pattern", 100);
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

                this.sprites.update();
                this.sprites.draw();

                if (this.gk.isOnDown(80)) { // Pキー
                    this.sm.push(new Pause(this.name + "-pause", this.sm)); // ポーズ
                }
                if (this.gk.isOnDown(84)) { // T
                    this.sm.pop(); // タイトルに戻る
                }
            }
        }
    }
}