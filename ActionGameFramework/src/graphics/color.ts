module Game {
    var colorkeywords = {
        "aliceblue": 0xf0f8ff,
        "antiquewhite": 0xfaebd7,
        "aqua": 0x00ffff,
        "aquamarine": 0x7fffd4,
        "azure": 0xf0ffff,
        "beige": 0xf5f5dc,
        "bisque": 0xffe4c4,
        "black": 0x000000,
        "blanchedalmond": 0xffebcd,
        "blue": 0x0000ff,
        "blueviolet": 0x8a2be2,
        "brown": 0xa52a2a,
        "burlywood": 0xdeb887,
        "cadetblue": 0x5f9ea0,
        "chartreuse": 0x7fff00,
        "chocolate": 0xd2691e,
        "coral": 0xff7f50,
        "cornflowerblue": 0x6495ed,
        "cornsilk": 0xfff8dc,
        "crimson": 0xdc143c,
        "cyan": 0x00ffff,
        "darkblue": 0x00008b,
        "darkcyan": 0x008b8b,
        "darkgoldenrod": 0xb8860b,
        "darkgray": 0xa9a9a9,
        "darkgreen": 0x006400,
        "darkgrey": 0xa9a9a9,
        "darkkhaki": 0xbdb76b,
        "darkmagenta": 0x8b008b,
        "darkolivegreen": 0x556b2f,
        "darkorange": 0xff8c00,
        "darkorchid": 0x9932cc,
        "darkred": 0x8b0000,
        "darksalmon": 0xe9967a,
        "darkseagreen": 0x8fbc8f,
        "darkslateblue": 0x483d8b,
        "darkslategray": 0x2f4f4f,
        "darkslategrey": 0x2f4f4f,
        "darkturquoise": 0x00ced1,
        "darkviolet": 0x9400d3,
        "deeppink": 0xff1493,
        "deepskyblue": 0x00bfff,
        "dimgray": 0x696969,
        "dimgrey": 0x696969,
        "dodgerblue": 0x1e90ff,
        "firebrick": 0xb22222,
        "floralwhite": 0xfffaf0,
        "forestgreen": 0x228b22,
        "fuchsia": 0xff00ff,
        "gainsboro": 0xdcdcdc,
        "ghostwhite": 0xf8f8ff,
        "gold": 0xffd700,
        "goldenrod": 0xdaa520,
        "gray": 0x808080,
        "green": 0x008000,
        "greenyellow": 0xadff2f,
        "grey": 0x808080,
        "honeydew": 0xf0fff0,
        "hotpink": 0xff69b4,
        "indianred": 0xcd5c5c,
        "indigo": 0x4b0082,
        "ivory": 0xfffff0,
        "khaki": 0xf0e68c,
        "lavender": 0xe6e6fa,
        "lavenderblush": 0xfff0f5,
        "lawngreen": 0x7cfc00,
        "lemonchiffon": 0xfffacd,
        "lightblue": 0xadd8e6,
        "lightcoral": 0xf08080,
        "lightcyan": 0xe0ffff,
        "lightgoldenrodyellow": 0xfafad2,
        "lightgray": 0xd3d3d3,
        "lightgreen": 0x90ee90,
        "lightgrey": 0xd3d3d3,
        "lightpink": 0xffb6c1,
        "lightsalmon": 0xffa07a,
        "lightseagreen": 0x20b2aa,
        "lightskyblue": 0x87cefa,
        "lightslategray": 0x778899,
        "lightslategrey": 0x778899,
        "lightsteelblue": 0xb0c4de,
        "lightyellow": 0xffffe0,
        "lime": 0x00ff00,
        "limegreen": 0x32cd32,
        "linen": 0xfaf0e6,
        "magenta": 0xff00ff,
        "maroon": 0x800000,
        "mediumaquamarine": 0x66cdaa,
        "mediumblue": 0x0000cd,
        "mediumorchid": 0xba55d3,
        "mediumpurple": 0x9370db,
        "mediumseagreen": 0x3cb371,
        "mediumslateblue": 0x7b68ee,
        "mediumspringgreen": 0x00fa9a,
        "mediumturquoise": 0x48d1cc,
        "mediumvioletred": 0xc71585,
        "midnightblue": 0x191970,
        "mintcream": 0xf5fffa,
        "mistyrose": 0xffe4e1,
        "moccasin": 0xffe4b5,
        "navajowhite": 0xffdead,
        "navy": 0x000080,
        "oldlace": 0xfdf5e6,
        "olive": 0x808000,
        "olivedrab": 0x6b8e23,
        "orange": 0xffa500,
        "orangered": 0xff4500,
        "orchid": 0xda70d6,
        "palegoldenrod": 0xeee8aa,
        "palegreen": 0x98fb98,
        "paleturquoise": 0xafeeee,
        "palevioletred": 0xdb7093,
        "papayawhip": 0xffefd5,
        "peachpuff": 0xffdab9,
        "peru": 0xcd853f,
        "pink": 0xffc0cb,
        "plum": 0xdda0dd,
        "powderblue": 0xb0e0e6,
        "purple": 0x800080,
        "red": 0xff0000,
        "rosybrown": 0xbc8f8f,
        "royalblue": 0x4169e1,
        "saddlebrown": 0x8b4513,
        "salmon": 0xfa8072,
        "sandybrown": 0xf4a460,
        "seagreen": 0x2e8b57,
        "seashell": 0xfff5ee,
        "sienna": 0xa0522d,
        "silver": 0xc0c0c0,
        "skyblue": 0x87ceeb,
        "slateblue": 0x6a5acd,
        "slategray": 0x708090,
        "slategrey": 0x708090,
        "snow": 0xfffafa,
        "springgreen": 0x00ff7f,
        "steelblue": 0x4682b4,
        "tan": 0xd2b48c,
        "teal": 0x008080,
        "thistle": 0xd8bfd8,
        "tomato": 0xff6347,
        "turquoise": 0x40e0d0,
        "violet": 0xee82ee,
        "wheat": 0xf5deb3,
        "white": 0xffffff,
        "whitesmoke": 0xf5f5f5,
        "yellowgreen": 0x9acd32
    };
    export class Color {
        public r;
        public g;
        public b;
        public a;
        // UNDONE
        constructor(scheme: string, list: number[]);
        constructor(scheme: string, x: number, y: number, z: number, w: number);
        constructor(scheme: string, x: number, y: number, z: number);
        constructor(color: string);
        constructor(color: number);
        constructor(a: any, b?: any, c?: any, d?: any, e?: any) {
            if (b !== undefined) {
                a = a.trim().toLowerCase();
                if (a == "rgba") {
                    if (Array.isArray(b)) this.setRGBA.apply(this, b);
                    else this.setRGBA(b, c, d, e);
                }
                else if (a == "rgb") {
                    if (Array.isArray(b)) this.setRGB.apply(this, b);
                    else this.setRGB(b, c, d);
                }
                else if (a == "hsla") {
                    if (Array.isArray(b)) this.setHSLA.apply(this, b);
                    else this.setHSLA(b, c, d, e);
                }
                else if (a == "hsl") {
                    if (Array.isArray(b)) this.setHSL.apply(this, b);
                    else this.setHSL(b, c, d);
                }
                else {
                    throw new Error("undefined notation \"" + a + "\"");
                }
            }
            else {
                if (typeof a == "number") {
                    this.setNumber(a);
                }
                else if (typeof a == "string") {
                    this.setColorByString(a);
                }
                else {
                    throw new Error("invalid arugment");
                }
            }
        }
        setKeyword(color: string) {
            this.setRGB.apply(this, Color.Number2RGB(colorkeywords[color]));
        }
        // value:[0x000000,0xffffff]
        setNumber(value: number) {
            this.setRGB.apply(this, Color.Number2RGB(value));
        }
        // #000000 .. #ffffff または #000 .. #fff
        setHex(color: string) {
            this.setRGB.apply(this, Color.Hex2RGB(color));
        }
        // r,g,b,a:[0,255]
        setRGBA(r: number, g: number, b: number, a: number) {
            this.r = Color.limit(Math.round(r), 0, 255);
            this.g = Color.limit(Math.round(g), 0, 255);
            this.b = Color.limit(Math.round(b), 0, 255);
            this.a = Color.limit(a, 0, 1);
        }
        // r,g,b:[0,255]
        setRGB(r: number, g: number, b: number) {
            this.setRGBA(r, g, b, 1);
        }
        // h∈[0,360), s,l∈[0,1]
        setHSLA(h: number, s: number, l: number, a: number) {
            this.setRGBA.apply(this, Color.HSL2RGB(h, s, l).concat(a));
        }
        // h∈[0,360), s,l∈[0,1]
        setHSL(h: number, s: number, l: number) {
            this.setHSLA(h, s, l, 1);
        }
        setColorByString(color: string) {
            color = color.trim().toLowerCase();
            var mode = Color.getNotationMode(color);
            if (mode == "hex") {
                this.setHex(color);
            }
            else if (mode == "keyword") {
                this.setKeyword(color);
            }
            else if (mode == "rgb") {
                this.setRGB.apply(this, Color.getRGBColorByFunctionalNotation(color));
            }
            else if (mode == "rgba") {
                this.setRGBA.apply(this, Color.getRGBAColorByFunctionalNotation(color));
            }
            else if (mode == "hsl") {
                this.setHSL.apply(this, Color.getHSLColorByFunctionalNotation(color));
            }
            else if (mode == "hsla") {
                this.setHSLA.apply(this, Color.getHSLAColorByFunctionalNotation(color));
            }
        }
        // [R,G,B]
        getRGB() {
            return [this.r, this.g, this.b];
        }
        // [R,G,B,A]
        getRGBA() {
            return [this.r, this.g, this.b, this.a];
        }
        getHSL() {
            return Color.RGB2HSL(this.r, this.g, this.b);
        }
        getHSLA() {
            return Color.RGB2HSL(this.r, this.g, this.b).concat([this.a]);
        }
        getNumber() {
            return Color.RGB2Number(this.r, this.g, this.b);
        }
        getHex() {
            return Color.RGB2Hex(this.r, this.g, this.b);
        }
        // h∈[0,360), s,l∈[0,1]
        static HSL2RGB(h: number, s: number, l: number): Array<number> {
            // hsl値の正規化
            h = h % 360 >= 0 ? h % 360 : h % 360 + 360; // [0,360)に正規化する
            s = Color.limit(s, 0, 1); // [0,1]
            l = Color.limit(l, 0, 1); // [0,1]
            var result = [0, 0, 0];
            var C = (1 - Math.abs(l * 2 - 1)) * s; // chroma
            var H_ = h / 60;
            var X = C * (1 - Math.abs(H_ % 2 - 1));
            var rgb_ = [0, 0, 0];
            if (0 <= H_ && H_ < 1) rgb_ = [C, X, 0];
            else if (1 <= H_ && H_ < 2) rgb_ = [X, C, 0];
            else if (2 <= H_ && H_ < 3) rgb_ = [0, C, X];
            else if (3 <= H_ && H_ < 4) rgb_ = [0, X, C];
            else if (4 <= H_ && H_ < 5) rgb_ = [X, 0, C];
            else if (5 <= H_ && H_ < 6) rgb_ = [C, 0, X];
            var m = l - C / 2;
            result[0] = Color.limit(Math.round((rgb_[0] + m) * 255), 0, 255);
            result[1] = Color.limit(Math.round((rgb_[1] + m) * 255), 0, 255);
            result[2] = Color.limit(Math.round((rgb_[2] + m) * 255), 0, 255);
            return result;
        }
        // r,g,b:[0,255]
        static RGB2HSL(r: number, g: number, b: number): Array<number> {
            var result = [0, 0, 0];
            // rgb値を[0,1]に正規化する
            r = Color.limit(r / 255, 0, 1);
            g = Color.limit(g / 255, 0, 1);
            b = Color.limit(b / 255, 0, 1);
            var Cmax = Math.max(r, g, b);
            var Cmin = Math.min(r, g, b);
            var D = Cmax - Cmin;
            var h;
            if (D == 0) h = 0;
            else if (Cmax == r) h = ((g - b) / D % 6) * 60;
            else if (Cmax == g) h = ((b - r) / D + 2) * 60;
            else if (Cmax == b) h = ((r - g) / D + 4) * 60;
            h = h % 360 >= 0 ? h % 360 : h % 360 + 360; // [0,360)に正規化する
            var l;
            l = (Cmax + Cmin) / 2;
            var s;
            if (D == 0) s = 0;
            else s = D / (1 - Math.abs(l * 2 - 1));
            result[0] = h;
            result[1] = s;
            result[2] = l;
            return result;
        }
        // 数値からそれに対応するRGB値へ変換
        static Number2RGB(color: number): Array<number> { // RGBAにはできません
            if (color < 0 || color > 0xffffff) {
                throw new Error("invalid color value");
                return null;
            }
            var r = (color >> 16) & 0xff;
            var g = (color >> 8) & 0xff;
            var b = color & 0xff;
            // return "#" + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2); // これはhex表記
            return [r, g, b];
        }
        // r,g,b:[0,255]
        static RGB2Number(r: number, g: number, b: number): number {
            return (r << 16 + r << 8 + b);
        }
        // #000000 .. #ffffff または #000 .. #fff
        static Hex2RGB(color: string): Array<number> {
            color = color.trim().toLowerCase();
            if (color.search(/^#[a-fA-F0-9]{3,6}$/g) == -1) {
                throw new Error("incorrect HEX notation");
                return null;
            }
            if (color.length == 6 + 1) {
                return Color.Number2RGB(Number("0x" + color.slice(1)));
            }
            else if (color.length == 3 + 1) {
                var tmp = color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
                return Color.Number2RGB(Number("0x" + tmp));
            }
            throw new Error("incorrect digit");
            return null;
        }
        // r,g,b:[0,255]
        static RGB2Hex(r: number, g: number, b: number): string {
            return "#" + Color.RGB2Number(r, g, b).toString(16);
        }
        // 色の表記方法の判別
        static getNotationMode(color: string): string {
            color = color.trim().toLowerCase();
            if (color.search(/^#[a-fA-F0-9]{3,6}$/g) != -1) { // 16進数表記
                return "hex";
            }
            else if (colorkeywords[color] !== undefined) { // 色名リスト内に色が存在する
                return "keyword";
            }
            else { // そうでない場合、関数表記法の判定へ
                return Color.getFunctionalNotationMode(color);
            }
        }
        // どの方式の関数表記かを判別する
        static getFunctionalNotationMode(color: string): string {
            color = color.trim().toLowerCase();
            var left = color.slice(0, 5);
            var right = color.slice(-1);
            if (left.slice(0, 4) == "rgb(" && right == ")") {
                return "rgb";
            }
            else if (left.slice(0, 4) == "hsl(" && right == ")") {
                return "hsl";
            }
            else if (left == "rgba(" && right == ")") {
                return "rgba";
            }
            else if (left == "hsla(" && right == ")") {
                return "hsla";
            }
            return null;
        }
        static getRGBColorByFunctionalNotation(color: string): Array<number> {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "rgb") {
                throw new Error("incorrect RGB notation");
                return null;
            }
            color = color.slice(4).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 3) {
                throw new Error("incorrect RGB notation");
                return null;
            }
            var result = [0, 0, 0];
            var flag_percent = tmp[0].slice(-1) == "%";
            for (var i = 0; i < tmp.length; i++) {
                var x = 0;
                if (tmp[i].slice(-1) == "%") { // %表記
                    if (!flag_percent) {
                        throw new Error("incorrect RGB notation");
                        return null;
                    }
                    x = Color.limit(Math.floor(Number(tmp[i].slice(0, -1)) * 255 / 100), 0, 255);
                }
                else if (tmp[i].search(/\./) == -1 && Number(tmp[i]) != NaN) { // 整数、 [0,255]
                    if (flag_percent) {
                        throw new Error("incorrect RGB notation");
                        return null;
                    }
                    x = Color.limit(Number(tmp[i]), 0, 255);
                }
                else {
                    throw new Error("incorrect RGB notation");
                    return null;
                }
                result[i] = x;
            }
            return result;
        }
        static getRGBAColorByFunctionalNotation(color: string): Array<number> {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "rgba") {
                throw new Error("incorrect RGBA notation");
                return null;
            }
            color = color.slice(5).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 4) {
                throw new Error("incorrect RGBA notation");
                return null;
            }
            var result = [0, 0, 0, 0];
            var flag_percent = tmp[0].slice(-1) == "%";
            for (var i = 0; i < tmp.length; i++) {
                var x = 0;
                if (i == 3) { // [0,1]
                    x = 1;
                    if (Number(tmp[i]) == NaN) {
                        throw new Error("incorrect RGBA notation");
                        return null;
                    }
                    x = Color.limit(Number(tmp[i]), 0, 1);
                }
                else {
                    if (tmp[i].slice(-1) == "%") { // %表記 [0,100]%
                        if (!flag_percent) {
                            throw new Error("incorrect RGBA notation");
                            return null;
                        }
                        x = Color.limit(Math.floor(Number(tmp[i].slice(0, -1)) * 255 / 100), 0, 255);
                    }
                    else if (tmp[i].search(/\./) == -1 && Number(tmp[i]) != NaN) { // 整数、[0,255]
                        if (flag_percent) {
                            throw new Error("incorrect RGBA notation");
                            return null;
                        }
                        x = Color.limit(Number(tmp[i]), 0, 255);
                    }
                    else {
                        throw new Error("incorrect RGBA notation");
                        return null;
                    }
                }
                result[i] = x;
            }
            return result;
        }
        static getHSLColorByFunctionalNotation(color: string): Array<number> {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "hsl") {
                throw new Error("incorrect HSL notation");
                return null;
            }
            color = color.slice(4).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 3) {
                throw new Error("incorrect HSL notation");
                return null;
            }
            var result = [0, 0, 0];
            for (var i = 0; i < tmp.length; i++) {
                var x = 255;
                if ((i == 1 || i == 2) && tmp[i].slice(-1) == "%") { // %表記 [0,100]%
                    x = Color.limit(Number(tmp[i].slice(0, -1)) / 100, 0, 1); // [0,1]に正規化する
                }
                else if (i == 0 && Number(tmp[i]) != NaN) { // [0,360]
                    x = Color.limit(Number(tmp[i]), 0, 360);
                }
                else {
                    throw new Error("incorrect HSL notation");
                    return null;
                }
                result[i] = x;
            }
            return result;
        }
        static getHSLAColorByFunctionalNotation(color: string): Array<number> {
            var color = color.trim().toLowerCase();
            if (Color.getFunctionalNotationMode(color) != "hsla") {
                throw new Error("incorrect HSLA notation");
                return null;
            }
            color = color.slice(5).slice(0, -1).trim();
            var tmp = color.split(/\s*,\s*/g);
            if (tmp.length != 4) {
                throw new Error("incorrect HSLA notation");
                return null;
            }
            var result = [0, 0, 0, 0];
            for (var i = 0; i < tmp.length; i++) {
                var x = 255;
                if (i == 3) { // [0,1]
                    x = 1;
                    if (Number(tmp[i]) == NaN) {
                        throw new Error("incorrect HSLA notation");
                        return null;
                    }
                    x = Color.limit(Number(tmp[i]), 0, 1);
                }
                else if ((i == 1 || i == 2) && tmp[i].slice(-1) == "%") { // %表記 [0,100]%
                    x = Color.limit(Number(tmp[i].slice(0, -1)) / 100, 0, 1); // [0,1]に正規化する
                }
                else if (i == 0 && Number(tmp[i]) != NaN) { // [0,360]
                    x = Color.limit(Number(tmp[i]), 0, 360);
                }
                else {
                    throw new Error("incorrect HSLA notation");
                    return null;
                }
                result[i] = x;
            }
            return result;
        }
        static limit(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        }
    }
}