
import TypeUtil from "./TypeUtil";

class Record {
  static buildRecords<T extends object,U extends keyof T>(value: T, keys: U[]) {
    return keys.map((item) => {
      return new Record(item, TypeUtil.deepCopy(value[item]));
    });
  }
  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
  }
  key: any;
  value: any;
}

class Backtrack {
  //用于属性回溯,不记录方法
  static #recordsMap: WeakMap<object, Record[]> = new WeakMap();
  static record<T extends object, U extends keyof T>(value: T, keys: U[]) {
    if (typeof value !== "object") {
      throw new Error("value must be an object");
    }
    if (!(keys instanceof Array)) {
      keys = Array.from(keys);
    }
    let records = Record.buildRecords(value, keys);
    this.#recordsMap.set(value, records);
  }
  static recordAll<T extends object>(value:T){
    this.record(value,Object.keys(value) as any)
  }
  static backtrack<T extends object>(value: T) {
    let records = this.#recordsMap.get(value);
    if (records != null && value != null) {
      records.forEach((item) => {
        value[item.key] = item.value;
      });
    }
  }
  static backtrackAndRemove<T extends object>(value: T) {
    this.backtrack(value);
    this.remove(value);
  }

  static remove<T extends object>(value: T) {
    this.#recordsMap.delete(value);
  }
}

export default Backtrack;
