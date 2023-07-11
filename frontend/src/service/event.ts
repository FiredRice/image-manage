import { EventsOn, EventsOff, EventsOnce, EventsOnMultiple, EventsEmit } from 'wailsjs/runtime/runtime';

class EventManager {
    private events: string[] = [];

    /**
     * 为给定的事件名称设置一个侦听器。 当触发名为 eventName 类型的事件时，将触发回调。 与触发事件一起发送的任何其他数据都将传递给回调。 
     * @param eventName 事件名
     * @param callback 回调
     * @returns 取消侦听器
     */
    public on(eventName: string, callback: (...data: any) => void) {
        this.events.push(eventName);
        return EventsOn(eventName, callback);
    }

    /**
     * 为给定的事件名称设置一个侦听器，但最多只能触发 counter 次
     * @param eventName 事件名
     * @param callback 回调
     * @param maxCallbacks 触发次数
     * @returns 取消侦听器
     */
    public onMultiple(eventName: string, callback: (...data: any) => void, maxCallbacks: number) {
        this.events.push(eventName);
        return EventsOnMultiple(eventName, callback, maxCallbacks);
    }

    /**
     * 为给定的事件名称设置一个侦听器，但只会触发一次。
     * @param eventName 事件名
     * @param callback 回调
     * @returns 取消侦听器
     */
    public once(eventName: string, callback: (...data: any) => void) {
        this.events.push(eventName);
        return EventsOnce(eventName, callback);
    }

    /**
     * 此方法触发指定的事件。 可选数据可以与事件一起传递。 这将触发任意事件侦听器。
     * @param eventName 事件名
     * @param data 数据
     */
    public emit(eventName: string, ...data: any) {
        EventsEmit(eventName, ...data)
    }

    /**
     * 取消注册给定事件名称的侦听器，可选地，可以通过 additionalEventNames 取消注册多个侦听器。
     * @param eventName 事件名
     * @param additionalEventNames 其余事件名
     */
    public off(eventName: string, ...additionalEventNames: string[]) {
        EventsOff(eventName, ...additionalEventNames);
    }

    /**
     * 移除所有注册的事件
     */
    public removeAll() {
        const [name, ...otherNames] = this.events;
        this.off(name, ...otherNames);
    }
}

export default EventManager;