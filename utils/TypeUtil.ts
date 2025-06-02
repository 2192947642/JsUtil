import { Emitter } from "./EventUtil";
class TypeUtil {
  public static isEmpytObject(obj: object) {
    if (obj instanceof Object) {
      if (Object.keys(obj).length == 0) return true;
      return false;
    }
    return true;
  }
  public static copyNotNull<T extends object, K extends object>(
    target: T,
    from: K
  ) {
    if (target instanceof Object && from instanceof Object) {
      for (let key in from) {
        if (from[key] != null) (target as any)[key] = from[key];
      }
    }
  }
  public static copy<T extends object>(target: T, from: T) {
    if (target instanceof Object && from instanceof Object)
      for (let key in from) {
        target[key] = from[key];
      }
  }
  public static commonKeyCopy<T extends object>(target: T, from: T): void {
    if (target instanceof Object && from instanceof Object) {
      for (let key in target) {
        if (target.hasOwnProperty(key) && from.hasOwnProperty(key)) {
          target[key] = from[key]; // 类型安全：key 是 T 的已知属性
        }
      }
    }
  }
  
  public static anyCopy<T extends object, K extends keyof T>(
    k: K[],
    from: T
  ): Pick<T, K> {
    const t = {} as Pick<T, K>; // 断言结果类型
    for (const key of k) {
      t[key] = from[key]; // 类型安全：K 是 T 的已知键
    }
    return t;
  }


  static deepCopy<T>(original: T): T {
    if (typeof original !== "object" || original === null) {
      return original; // 基本类型直接返回
    }
    if (
      original instanceof String ||
      original instanceof Number ||
      original instanceof Boolean
    ) {
      return original; // 直接返回包装对象
    }
    const copy = Object.create(Object.getPrototypeOf(original));
    for (const key in original) {
      if (original.hasOwnProperty(key)) {
        copy[key] = TypeUtil.deepCopy(original[key]); // 递归拷贝
      }
    }
    return copy;
  }
  static uuid() {
    var s: any[] = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substring((s[19] as any & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }
  static mapToArray<K,V>(m: Map<K, V>) {
    let arr:V[] = [];
    m.forEach((value, key) => {
      arr.push(value);
    });
    return arr;
  }

  static toString(obj: any) {
    if (typeof obj == "string") return obj;
    else return JSON.stringify(obj);
  }
}


export default TypeUtil;
