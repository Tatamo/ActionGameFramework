module Game {
    export interface ISpriteSystem {
        AllSprites: IGroup;
        add(s: ISprite);
        remove(s: ISprite);
    }
}