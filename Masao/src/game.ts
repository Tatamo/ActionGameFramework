module Game {
    export class GameStateMachine extends StateMachine {
        public game: Game;
        constructor(game: Game, parent: any = null) {
            super(parent);
            this.game = game;
        }
    }
    export class Game extends Core {
        public score: ScoreManager;
        public hud_score: number;
        public hud_highscore: number;
        constructor(config: any) {
            super(config);
            this.statemachine = new GameStateMachine(this);
            this.score = new ScoreManager();
            this.hud_score = this.score.GetScore();
            this.hud_highscore = this.score.GetHighScore();
            this.addEventHandler("update",() => { // スコア描画
                var ctx = this.screen.context;
                ctx.save();
                ctx.fillStyle = "blue";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.font = "bold 14px sans-serif";
                ctx.fillText("SCORE " + this.hud_score.toString() + "  HIGHSCORE " + this.hud_highscore.toString(), 40, 20);
                ctx.restore();
            });
            this.score.addEventHandler("scorechanged",(() => { this.hud_score = this.score.GetScore(); }).bind(this)); // thisでbindしておく ハイスコアの処理ははstage.tsに
        }
    }
}