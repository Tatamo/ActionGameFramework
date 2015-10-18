module Game {
    export module States {
        export class GameState extends AbstractState {
        }
        export class Preload extends GameState {
            enter(sm: GameStateMachine) {
                var assets = sm.game.assets;

                assets.image.regist_image("title", "title.gif");
                assets.image.regist_image("gameover", "gameover.gif");
                assets.image.regist_image("ending", "ending.gif");
                assets.image.regist_pattern("pattern", "pattern.gif", 32, 32);
                assets.load();

            }
            update(sm: GameStateMachine) {
                var loader = sm.game.assets.loader;
                if (loader.is_load_completed) {
                    sm.replace(new Title());
                }
            }
        }
    }
}