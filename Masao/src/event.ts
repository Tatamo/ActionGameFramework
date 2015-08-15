module Game {
    export class SpriteCollisionEvent extends SpriteEvent {
        constructor(public type: string, public sprite: ISprite, public dir: string = "none", public mode: string = "edge") {
            super(type, sprite);
        }
    }
}