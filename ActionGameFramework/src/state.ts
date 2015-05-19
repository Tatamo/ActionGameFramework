
module Game {
    export interface State {
        parent: State;
        //name: string;
        sm: StateMachine;
        enter();
        update();
        exit();
    }

    export module States {
        export class AbstractState implements State {
            parent: State;
            //name: string;
            sm: StateMachine;
            //constructor(name: string, sm: GameStateMachine) {
            constructor(sm: StateMachine) {
                //this.name = name;
                this.sm = sm;
            }
            enter() { }
            update() { }
            exit() { }
        }
    }
}