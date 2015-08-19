module Game {
    // ゲーム内オブジェクトの参照・走査を一手に引き受けるクラス。
    export class SpriteSystem implements ISpriteSystem {
        screen: Surface;
        public AllSprites: Group;
        public Players: Group;
        public MapBlocks: MapGroup;
        private groups: Array<IGroup>;
        constructor(screen: Surface) {
            this.screen = screen;
            this.AllSprites = new Group(screen);
            this.Players = new Group(screen);
            this.MapBlocks = new MapGroup(screen, 180, 30);
            this.groups = new Array<Group>();
            this.groups.push(this.AllSprites, this.Players, this.MapBlocks);
        }
        public add(s: ISprite) {
            this.AllSprites.add(s);
            if (s instanceof Player) {
                this.Players.add(s);
            }
            if (s instanceof Block) {
                this.MapBlocks.add(s);
            }
            s.ss = this;
        }
        public remove(s: ISprite) {
            for (var i = 0; i < this.groups.length; i++) {
                this.groups[i].remove(s)
            }
        }
        /*public virtual Block GetBlock(int x, int y) {
            try { return BlockData[x / 32, y / 32]; }
            catch { return null; }
        }*/
        getBlock(x: number, y: number):ISprite {
            return this.MapBlocks.getByXY(Math.floor(x / 32), Math.floor(y / 32));
        }
        getBlocks(x: number, y: number,width:number,height:number):Array<ISprite> {
            return this.MapBlocks.getByRectReal(x, y, width, height);
        }
    }
}