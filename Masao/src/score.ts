module Game {
    export class ScoreEvent extends Event {
        constructor(type: string, public value: number) {
            super(type);
        }
    }
    export class ScoreManager extends EventDispatcher {
        private _score: number;
        private _highscore: number;
        constructor() {
            super();
            this._score = 0;
            this._highscore = 0;
        }
        public AddScore(value:number) {
            var tmp = this._score;
            var flg = false;
            this._score += value;
            if (this._score < 0) this._score = 0;
            if (tmp == this._score) return;
            if (this._score > this._highscore) {
                this._highscore = this._score;
            }
            this.dispatchEvent(new ScoreEvent("scorechanged", this._score));
            if (flg) this.dispatchEvent(new ScoreEvent("highscorechanged", this._highscore));
        }
        public SetScore(value:number) {
            var tmp = this._score;
            var flg = false;
            this._score = value;
            if (this._score < 0) this._score = 0;
            if (tmp == this._score) return;
            if (this._score > this._highscore) {
                this._highscore = this._score;
            }
            this.dispatchEvent(new ScoreEvent("scorechanged", this._score));
            if (flg) this.dispatchEvent(new ScoreEvent("highscorechanged", this._highscore));
        }
        public GetScore(): number {
            return this._score;
        }
        public GetHighScore(): number {
            return this._highscore;
        }
        public Reset() { // スコアとハイスコア両方を0にする
            if (this._score != 0) {
                this._score = 0;
                this.dispatchEvent(new ScoreEvent("scorechanged", this._score));
            }
            if (this._highscore != 0) {
                this._highscore = 0;
                this.dispatchEvent(new ScoreEvent("highscorechanged", this._highscore));
            }

        }
    }
}