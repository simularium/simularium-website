import { forOwn, isFunction } from "lodash";
import React from "react";
import queryString from "query-string";
import { URL_PARAM_KEY_TIME } from "../constants";
import { IconGlyphs } from "../constants/interfaces";

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
        .replace(/\s\w/g, function (c) {
            return c.toLowerCase();
        })
        .replace(/(^\s*\w|[\.\!\?]\s+\w)/g, function (c) {
            return c.toUpperCase();
        });
}

export const wrapText = (
    text: string,
    maxCharPerLine: number
): {
    formattedText: string;
    numLines: number;
} => {
    let numLines = 0;
    // Recursively break text into lines
    const insertBreaks = (text: string): string => {
        numLines++;
        const words = text.split(" ");

        // No need to process if text is already short enough or there is only 1 word
        if (text.length <= maxCharPerLine || words.length === 1) {
            return text;
        }

        // Do some processing if text is too long for 1 line
        let numWordsInCurrentLine = 0;
        let currentLineLength = 0;
        // Get number of words that can fit in current line by summing lengths of words
        // until maxCharPerLine is reached
        for (let i = 0; i < words.length - 1; i++) {
            // Add 1 character for space if current word is not the first word in line
            if (i !== 0) currentLineLength++;
            currentLineLength += words[i].length;
            if (currentLineLength + 1 + words[i + 1].length > maxCharPerLine) {
                numWordsInCurrentLine = i + 1;
                break;
            }
        }
        // Insert line break and repeat with remaining words
        const textInCurrentLine =
            words.slice(0, numWordsInCurrentLine).join(" ") + "<br>";
        const remainingText = words.slice(numWordsInCurrentLine).join(" ");
        return textInCurrentLine + insertBreaks(remainingText);
    };
    return {
        formattedText: insertBreaks(text),
        numLines: numLines,
    };
};

export const hasUrlParamsSettings = () => {
    const urlSettings = [URL_PARAM_KEY_TIME];
    const parsed = queryString.parse(location.search);
    for (let index = 0; index < urlSettings.length; index++) {
        const paramName = urlSettings[index];
        if (parsed[paramName] !== undefined) {
            return true;
        }
    }
    return false;
};

export const editUrlParams = (
    url: string,
    value: string,
    paramKey: string
): string => {
    // this returns a new url as a string, does not change current url shown in browser
    const currentUrl = new URL(url);
    const params = new URLSearchParams(currentUrl.search);
    params.set(paramKey, value);
    currentUrl.search = params.toString();
    return currentUrl.toString();
};

export const clearBrowserUrlParams = () => {
    // Removes the query string from the current URL shown in the browser
    // ex) https://mysite.com/path?city=seattle -> https://mysite.com/path
    history.replaceState({}, "", `${location.origin}${location.pathname}`);
};

export const roundTimeForDisplay = (time: number): number => {
    if (time === 0) {
        return 0;
    }
    return parseFloat(time.toPrecision(3));
};

export const getIconGlyphClasses = (name: IconGlyphs) => {
    return `icon-moon anticon ${name}`;
};
