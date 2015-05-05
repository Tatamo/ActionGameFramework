module Game {
    export module States {
        export class Title extends AbstractState {
            titleimg: HTMLCanvasElement;
            enter() {
                console.log(this.name);
                this.titleimg = this.sm.game.assets.image.get("title");
            }
            update() {
                this.sm.game.screen.context.drawImage(this.titleimg, 0, 0);
                if (this.sm.game.gamekey.isOnDown(90)) { // Z
                    this.sm.push(new Stage("stage", this.sm));
                }
            }
        }
    }
}