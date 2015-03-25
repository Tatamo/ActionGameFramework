module Game {
    // WeakMap同様の操作が可能で、numberとstringのキーを持つデータ構造です
    export class Dictionary<T> implements WeakMap<any, T>{
        private datalist: {};
        constructor() {
            this.datalist = {};
        }
        // 中身を初期化しますよ
        clear() {
            this.datalist = {};
        }
        // 新しくインスタンスを登録します
        set(key: number, value: T);
        set(key: string, value: T);
        set(key: any, value: T, ...args: any[]) {
            this.checkType(key);
            /*if (this.datalist[key] != undefined) {
                throw new Error("State \"" + key + "\"is already defined.");
            }*/
            this.datalist[key] = value;
            return this;
        }
        // 登録されたオブジェクトを削除します
        delete(key: string): boolean;
        delete(key: number): boolean;
        delete(key: any): boolean {
            this.checkType(key);
            return delete this.datalist[key];
        }
        // インスタンスを取得します
        get(key: string): T;
        get(key: number): T;
        get(key: any): T {
            this.checkType(key);
            return this.datalist[key];
        }
        // オブジェクトが存在する場合、登録されているキーを返します
        getkey(value: T) {
            var result: string;
            for (var key in this.datalist) {
                if (this.datalist[key] == value) {
                    result = key;
                    break;
                }
            }
            return result;
        }
        // キーが登録されているか調べます
        has(key: string): boolean;
        has(key: number): boolean;
        has(key: any): boolean {
            this.checkType(key);
            if (this.datalist[key] != undefined) return true;
            else return false;
        }
        private checkType(key: any): void {
            if (typeof key != "number" && typeof key != "string") {
                throw new Error("key is neither string nor number");
            }
        }
    }
    // 一度登録すると値を変えられないDictionaryです(削除は可能)
    export class Registrar<T> extends Dictionary<T>{
        // 新しくインスタンスを登録します
        set(key: string, value: T);
        set(key: number, value: T);
        set(key: any, value: T) {
            if (this.has(key)) {
                throw new Error("\"" + key + "\"is already defined.");
            }
            super.set(key, value);
        }
    }
    // 順番を持つデータ構造です
    export class AbstractDataGroup<T> {
        private datalist: Array<T>;
        sortmethod: (x: T, y: T) => number; // ソート方法
        constructor() {
            this.datalist = new Array<T>();
        }
        // 中身を初期化しますよ
        clear() {
            this.datalist = new Array<T>();
        }
        // 登録されているSpriteのリストを得ます
        getArray() {
            return this.datalist.slice(0);
        }
        // Spriteの個数を取得します
        getCount() {
            return this.datalist.length;
        }
        // Spriteを新しく追加します
        add(value: T) {
            this.datalist.push(value);
            this.sort();
        }
        // Spriteを並び替えます
        sort() {
            if (this.sortmethod) this.datalist.sort(this.sortmethod);
        }
        // Spriteを消去します
        del(value: T) {
            var index = 0;
            var flag = false;
            for (index = 0; index < this.datalist.length; index += 1) {
                if (this.datalist[index] == value) {
                    break;
                }
            }
            if (!flag) throw new Error("the object to be deleted not found.");
            this.datalist.splice(index, 1);
        }
    }
}