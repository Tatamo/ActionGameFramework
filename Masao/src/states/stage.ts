module Game {
    export module States {
        export class Stage extends GameState {
            player: Player;
            ss: SpriteSystem;
            constructor() {
                super();
            }
            enter(sm: GameStateMachine) {
                this.ss = new SpriteSystem(sm.game.screen);
                for (var i: number = 0; i < 8; i++) {
                    this.ss.add(new Block1(128 + i * 32, 160, sm.game.assets.image, "pattern"));
                }
                this.ss.add(new Block1(128, 192, sm.game.assets.image, "pattern"));
                this.ss.add(new Block1(128, 128, sm.game.assets.image, "pattern"));
                for (var i: number = 0; i < 12; i++) {
                    this.ss.add(new Block1(64 + i * 32, 256, sm.game.assets.image, "pattern"));
                }
                for (var i: number = 0; i < 8; i++) {
                    this.ss.add(new Block1(128 + i * 32, 96, sm.game.assets.image, "pattern"));
                }
                this.player = new Player(sm.game.gamekey, 64, 224, sm.game.assets.image, "pattern");
                this.ss.add(this.player);
            }
            update(sm: GameStateMachine) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.ss.AllSprites.update();
                this.ss.AllSprites.draw();

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