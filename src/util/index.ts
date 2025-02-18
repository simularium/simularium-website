import { ColorChange, IconGlyphs } from "../constants/interfaces";
import { UIDisplayData } from "@aics/simularium-viewer";

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

export const roundTimeForDisplay = (time: number): number => {
    if (time === 0) {
        return 0;
    }
    return parseFloat(time.toPrecision(3));
};

export const getIconGlyphClasses = (name: IconGlyphs) => {
    return `icon-moon anticon ${name}`;
};

export const formatFloatForDisplay = (float: number): string => {
    return parseFloat(float.toFixed(2)).toString();
};

export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
};

export const roundToTimeStepPrecision = (
    input: number,
    timestep: number
): number => {
    const precision = (timestep.toString().split(".")[1] || "").length;
    const multiplier = Math.pow(10, precision);
    return Math.round(input * multiplier) / multiplier;
};

/**
Compare two instaces of UIDisplayData to see if they have the same agents
and display states.
This data structure is used to store different color settings. 
We don't want to ever try and apply the color settings from one trajectory
to another, even if by chance they shared the same file name, or other
metadata.
*/
export const isSameAgentTree = (a: UIDisplayData, b: UIDisplayData) => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i].name !== b[i].name) {
            return false;
        }
        if (a[i].displayStates.length !== b[i].displayStates.length) {
            return false;
        }
        for (let j = 0; j < a[i].displayStates.length; j++) {
            if (
                a[i].displayStates[j].id !== b[i].displayStates[j].id ||
                a[i].displayStates[j].name !== b[i].displayStates[j].name
            ) {
                return false;
            }
        }
    }
    return true;
};

export const applyColorChangeToUiDisplayData = (
    colorChange: ColorChange,
    uiDisplayData: UIDisplayData
): UIDisplayData => {
    return uiDisplayData.map((agent) => {
        const newAgent = { ...agent };
        if (agent.name === colorChange.agent.name) {
            if (colorChange.agent.tags.includes("")) {
                newAgent.color = colorChange.color;
            }
            const newDisplayStates = agent.displayStates.map((state: any) => {
                if (colorChange.agent.tags.includes(state.id)) {
                    return {
                        ...state,
                        color: colorChange.color,
                    };
                }
                return state;
            });
            newAgent.displayStates = newDisplayStates;
        }
        return newAgent;
    });
};
