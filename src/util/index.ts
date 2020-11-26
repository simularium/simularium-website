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
    getWebGL2ErrorMessage: function() {
        return this.getErrorMessage();
    },
    getErrorMessage: function() {
        var message =
            'Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL 2</a>';
        var element = document.createElement("div");

        element.id = "webglmessage";
        element.style.fontFamily = "monospace";
        element.style.fontSize = "13px";
        element.style.fontWeight = "normal";
        element.style.textAlign = "center";
        element.style.background = "#fff";
        element.style.color = "#000";
        element.style.padding = "1.5em";
        element.style.width = "400px";
        element.style.margin = "5em auto 0";

        if (window.WebGL2RenderingContext) {
            message = message.replace("$0", "graphics card");
        } else {
            message = message.replace("$0", "browser");
        }

        element.innerHTML = message;
        return element;
    },
};
