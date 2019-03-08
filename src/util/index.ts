import { forOwn, isFunction } from "lodash";

type AnyFunction = () => any;

export function bindAll<T>(obj: T, methods: AnyFunction[]) {
    const setOfMethods = new Set(methods);
    forOwn(obj.constructor.prototype, (value, key) => {
        if (setOfMethods.has(value) && isFunction(value)) {
            Object.assign(obj, { [key]: value.bind(obj) });
        }
    });
}
