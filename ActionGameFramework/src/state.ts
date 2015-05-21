
module Game {
    export interface State {
        parent: State;
        //name: string;
        enter(sm: StateMachine);
        update(sm: StateMachine);
        exit(sm: StateMachine);
    }

    export module States {
        export class AbstractState implements State {
            parent: State;
            //name: string;
            //constructor(name: string, sm: GameStateMachine) {
            constructor() {
                //this.name = name;
            }
            enter(sm: StateMachine) { }
            update(sm: StateMachine) { }
            exit(sm: StateMachine) { }
        }
    }
}