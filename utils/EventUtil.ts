
// 定义事件类型集合
type EventTypes = keyof EventMap;

// 事件处理函数的参数类型映射
interface EventMap {
  "app:start": [];
  "app:stop": [];
  "user:login": [userId: string, username: string];
}



// 事件处理函数类型
type EventHandler<T extends EventTypes> = (...args: EventMap[T]) => void;

class Emitter {
  // 事件管理
  private static handlers: Map<EventTypes, EventHandler<EventTypes>[]> = new Map();

  // 检查事件是否已存在
  private static contains<T extends EventTypes>(
    event: T,
    callback: EventHandler<T>
  ): boolean {
    const callbacks = this.handlers.get(event);
    return callbacks?.includes(callback as EventHandler<EventTypes>) ?? false;
  }

  // 注册一次性事件 - 修正版本
  static once<T extends EventTypes>(
    event: T,
    callback: EventHandler<T>
  ) {
    if (this.contains(event, callback)) return;
    
    const wrappedCallback = (...args: EventMap[T]) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };
    
    this.on(event, wrappedCallback);
  }

  // 取消事件监听
  static off<T extends EventTypes>(event: T, callback: EventHandler<T>) {
    const callbacks = this.handlers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback as EventHandler<EventTypes>);
      if (index !== -1) callbacks.splice(index, 1);
    }
  }

  // 注册事件监听 - 修正版本
  static on<T extends EventTypes>(
    event: T,
    callback: EventHandler<T>
  ): EventHandler<T> | null {
    if (this.contains(event, callback)) return null;
    const callbacks = this.handlers.get(event) || [];
    callbacks.push(callback as EventHandler<EventTypes>);
    this.handlers.set(event, callbacks);
    return callback;
  }

  // 触发事件
  static emit<T extends EventTypes>(
    event: T,
    ...args: EventMap[T]
  ): void {
    const callbacks = this.handlers.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(...args);
      });
    }
  }
}

export {
  EventMap,
  Emitter
}