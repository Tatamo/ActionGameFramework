module Game {
    export class SpriteCollisionEvent extends SpriteEvent {
        constructor(public type: string, public sprite: Sprite, public dir: string = "none") {
            super(type, sprite);
        }
    }
}