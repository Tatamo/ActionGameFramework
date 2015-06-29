module Game {
    export module States {
        export class Stage extends GameState {
            player: Player;
            creatures: Group;
            blocks: MapGroup;
            constructor() {
                super();
            }
            enter(sm: GameStateMachine) {
                this.player = new Player(sm.game.gamekey, 224, 128, sm.game.assets.image, "pattern");
                this.creatures = new Group(sm.game.screen);
                this.blocks = new MapGroup(sm.game.screen, 180, 30);
                this.creatures.add(this.player);
                for (var i: number = 0; i < 8; i++) {
                    this.blocks.add(new Block1(128+i*32, 160, sm.game.assets.image, "pattern"));
                }
            }
            update(sm: GameStateMachine) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.creatures.update();
                this.blocks.update();

                this.creatures.draw();
                this.blocks.draw();

                if (sm.game.gamekey.isOnDown(80)) { // Pキー
                    sm.push(new Pause(sm)); // ポーズ
                }
                if (sm.game.gamekey.isOnDown(84)) { // T
                    sm.pop(); // タイトルに戻る
                }
            }
        }
    }
}