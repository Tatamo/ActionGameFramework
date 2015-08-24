module Game {
    export class GameStateMachine extends StateMachine {
        public game: Core;
        constructor(game: Core, parent: any = null) {
            super(parent);
            this.game = game;
        }
    }
    export class Game extends Core {
        constructor(config: any) {
            super(config);
            this.statemachine = new GameStateMachine(this);
        }
    }
}