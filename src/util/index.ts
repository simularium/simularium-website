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
    // Recursively break text into lines
    const insertBreaks = (text: string): string => {
        numLines++;
        const words = text.split(" ");

        if (text.length <= maxCharPerLine || words.length === 1) {
            return text;
        }

        let numWordsInCurrentLine = 0;
        let currentLineLength = 0;
        // Loop through words until maxCharPerLine is reached
        for (let i = 0; i < words.length - 1; i++) {
            // Add 1 character for space if this word is not the first word in line
            if (i !== 0) currentLineLength++;
            currentLineLength += words[i].length;
            if (currentLineLength + 1 + words[i + 1].length > maxCharPerLine) {
                numWordsInCurrentLine = i + 1;
                break;
            }
        }
        const textInCurrentLine = words
            .slice(0, numWordsInCurrentLine)
            .join(" ");

        // Insert line break and repeat with any remaining words
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
