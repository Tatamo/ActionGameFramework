module Game {
    export module States {
        export class Preload extends AbstractState {
            enter() {
                console.log(this.name);
                var assets = this.sm.game.assets;

                assets.image.regist_image("title", "title.gif");
                assets.image.regist_pattern("pattern", "pattern.gif", 32, 32);
                assets.load();

            }
            update() {
                var loader = this.sm.game.assets.loader;
                if (loader.state == PreloadStates.NOTHING2LOAD) {
                    this.sm.replace(new Title("title", this.sm));
                }
            }
        }
    }
}