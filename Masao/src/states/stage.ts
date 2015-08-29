module Game {
    export module States {
        export class Stage extends GameState {
            player: Player;
            ss: SpriteSystem;
            mm: MapGenerator;
            view_x: number;
            view_y: number;
            private is_initialized: boolean;
            constructor() {
                super();
                this.is_initialized = false;
            }
            enter(sm: GameStateMachine) {
                if (!this.is_initialized) {
                    sm.game.score.SetScore(0);
                    this.ss = new SpriteSystem(sm.game.screen);
                    this.mm = new MapGenerator(this.ss);
                    this.mm.generateMap(sm.game.config.map, 32, 32, sm.game);
                    /*
                    for (var i: number = 0; i < 6; i++) {
                        this.ss.add(new Block1(128 + i * 32, 160, sm.game.assets.image, "pattern"));
                    }
                    this.ss.add(new Block1(128, 192, sm.game.assets.image, "pattern"));
                    this.ss.add(new Block1(128, 128, sm.game.assets.image, "pattern"));
                    for (var i: number = 0; i < 12; i++) {
                        this.ss.add(new Block1(64 + i * 32, 256, sm.game.assets.image, "pattern"));
                    }
                    for (var i: number = 0; i < 6; i++) {
                        this.ss.add(new Block1(128 + i * 32, 96, sm.game.assets.image, "pattern"));
                    }
                    for (var i: number = 0; i < 3; i++) {
                        this.ss.add(new Block1(192 + i * 32, 224, sm.game.assets.image, "pattern"));
                    }
                    this.player = new Player(sm.game.gamekey, 224, 128, sm.game.assets.image, "pattern");
                    this.ss.add(this.player);*/
                    this.player = this.mm.player;
                    this.player.addEventHandler("ondie",(e: Event) => { sm.replace(new GameOver()); });
                    this.player.addEventHandler("addscore",(e: ScoreEvent) => { sm.game.score.AddScore(e.value); });
                    this.view_x = 0;
                    this.view_y = 0;
                    this.is_initialized = true;
                }
            }
            update(sm: GameStateMachine) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.ss.AllSprites.update();
                this.view_x = Math.round(this.player.x-160);
                this.view_y = Math.round(this.player.y-64);
                this.ss.AllSprites.draw(this.view_x,this.view_y);

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