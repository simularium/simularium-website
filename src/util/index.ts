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

export const wrapText = (
    text: string,
    maxCharPerLine: number
): {
    formattedText: string;
    numLines: number;
} => {
    let numLines = 0;
    const insertBreaks = (text: string): string => {
        numLines++;
        if (text.length <= maxCharPerLine) return text;

        const words = text.split(" ");
        if (words.length === 1) return text;

        let currentLineLength = 0;
        let numWordsInCurrentLine = 0;
        for (let i = 0; i < words.length - 1; i++) {
            // +1 to account for space between words
            currentLineLength += words[i].length + 1;
            numWordsInCurrentLine++;
            if (currentLineLength + words[i + 1].length > maxCharPerLine) {
                break;
            }
        }
        const textInCurrentLine = words
            .slice(0, numWordsInCurrentLine)
            .join(" ");
        if (words.length > numWordsInCurrentLine) {
            return (
                textInCurrentLine +
                "<br>" +
                insertBreaks(words.slice(numWordsInCurrentLine).join(" "))
            );
        } else {
            return textInCurrentLine;
        }
    };
    return {
        formattedText: insertBreaks(text),
        numLines: numLines,
    };
};
