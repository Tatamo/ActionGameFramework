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
                    sm.game.hud_highscore = sm.game.score.GetHighScore();
                    this.ss = new SpriteSystem(sm.game.screen);
                    this.mm = new MapGenerator(this.ss);
                    this.mm.generateMap(sm.game.config.map, 32, 32, sm.game);
                    for (var i: number = 0; i < 40; i++) { // TODO: もっとましにする
                        this.ss.add(new AbstractBlock(-32, -320 + i * 32, sm.game.assets.image, "pattern"));
                        this.ss.add(new AbstractBlock(32 * 180, -320 + i * 32, sm.game.assets.image, "pattern"));
                    }
                    for (var i: number = 0; i < 180; i++) {
                        this.ss.add(new AbstractBlock(i * 32, -320, sm.game.assets.image, "pattern"));
                    }
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
                    this.addEventHandler("onscroll",(e: Event) => {
                        this.player.view_x = this.view_x;
                        this.player.view_y = this.view_y;
                    });
                    var scroll = ((e: Event) => {
                        if (!this.player.flags["isAlive"]) {
                            this.player.removeEventHandler("update", scroll);
                            return;
                        }
                        var px = this.player.x;
                        var py = this.player.y;
                        var wx = px - this.view_x;
                        var wy = py - this.view_y;
                        if (wx < 96) {
                            this.view_x = px - 96;
                        }
                        else if (wx > 224) {
                            this.view_x = px - 224;
                        }
                        if (wy < 78) {
                            this.view_y = py - 78;
                        }
                        else if (wy > 176) {
                            this.view_y = py - 176;
                        }

                        this.fixViewXY();
                        this.dispatchEvent(new Event("onscroll"));
                    }).bind(this);
                    this.player.addEventHandler("update", scroll);
                    this.view_x = this.player.x - 96;
                    this.view_y = this.player.y - 176;
                    this.fixViewXY();
                    this.dispatchEvent(new Event("onscroll"));

                    this.is_initialized = true;
                }
            }
            update(sm: GameStateMachine) {
                // 背景色で埋めてみる
                sm.game.screen.context.fillStyle = "rgb(0,255,255)";
                sm.game.screen.context.fillRect(0, 0, screen.width, screen.height);

                this.ss.AllSprites.update();
                this.ss.AllSprites.draw(this.view_x, this.view_y);

                if (sm.game.gamekey.isOnDown(80)) { // Pキー
                    sm.push(new Pause(sm)); // ポーズ
                }
                if (sm.game.gamekey.isOnDown(84)) { // T
                    sm.pop(); // タイトルに戻る
                }
            }
            protected fixViewXY() { // view_xおよびview_yが画面外へ行かないよう補正する
                // TODO: マップサイズ決め打ちを改善
                if (this.view_x < 0) {
                    this.view_x = 0;
                }
                else if (this.view_x > 32 * 180 - SCREEN_WIDTH) {
                    this.view_x = 32 * 180 - SCREEN_WIDTH;
                }
                if (this.view_y < 0) {
                    this.view_y = 0;
                }
                else if (this.view_y > 32 * 30 - SCREEN_HEIGHT) {
                    this.view_y = 32 * 30 - SCREEN_HEIGHT;
                }

                this.view_x = Math.round(this.view_x);
                this.view_y = Math.round(this.view_y);
            }
        }
    }
}