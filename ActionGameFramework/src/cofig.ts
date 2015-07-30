module Game {
    // 読み込まれたマップの管理
    export class Config {
        public rawmap: Array<string>;
        public map: Array<string>;
        public image: { [key: string]: any; };
        public config: { [key: string]: any; };
        constructor(map: Array<string>, image: { [key: string]: any; }, config: { [key: string]: any; } = {}) {
            this.initconfig();
            this.initmap(map);
            this.image = image;
            this.config = config;
        }
        initconfig() {
            this.config = {};
            this.config["screen_width"] = 512;
            this.config["screen_height"] = 320;
            this.config["mapchip_width"] = 32;
            this.config["mapchip_height"] = 32;
            this.config["map_width"] = 180;
            this.config["map_height"] = 30;
        }
        initmap(map: Array<string>) {
            this.rawmap = map;
            this.map = [];
            // 横列をつなぎ合わせる
            for (var i = 0; i < map.length; i += 1) {
                if (i < this.config["map_height"]) {
                    this.map[i] = map[i];
                }
                else {
                    this.map[i % this.config["map_height"]] += map[i];
                }
            }
        }
    }
}