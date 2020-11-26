import { forOwn, isFunction } from "lodash";
import React from "react";

type AnyFunction = () => any;

export function bindAll<T extends React.Component>(
    obj: T,
    methods: AnyFunction[]
) {
    const setOfMethods = new Set(methods);

    forOwn(obj.constructor.prototype, (value, key) => {
        if (setOfMethods.has(value) && isFunction(value)) {
            Object.assign(obj, { [key]: value.bind(obj) });
        }
    });
}

export function convertToSentenceCase(string: string): string {
    if (!string) {
        return "";
    }
    return string
        .replace(/\s\w/g, function(c) {
            return c.toLowerCase();
        })
        .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) {
            return c.toUpperCase();
        });
}

// From https://github.com/mrdoob/three.js/blob/master/examples/jsm/WebGL.js
// Also see three.js docs https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
export const WEBGL = {
    isWebGL2Available: function() {
        try {
            var canvas = document.createElement("canvas");
            return !!(
                window.WebGL2RenderingContext && canvas.getContext("webgl2")
            );
        } catch (e) {
            return false;
        }
    },
};
