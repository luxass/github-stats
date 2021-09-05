// https://github.com/tecfu/smartwrap


import wcwidth from "wcwidth";
import stripansi from "strip-ansi";
import { WordWrapOptions } from "./types";
function breakword(input: string | number, breakAtLength: number) {
    const charArr = Array.from(input.toString());
    let index = 0;
    let indexOfLastFitChar = 0;
    let fittableLength = 0;

    while (charArr.length > 0) {
        const char = charArr.shift() || "";
        const currentLength = fittableLength + wcwidth(char);

        if (currentLength <= breakAtLength) {
            indexOfLastFitChar = index;
            fittableLength = currentLength;
            index++;
        } else {
            break;
        }
    }

    //break after this character
    return indexOfLastFitChar;
}

const ANSIPattern =
    /[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))/g;

const defaults = (): WordWrapOptions => {
    return {
        breakWord: false,
        input: [], // input string split by whitespace
        minWidth: 2, // fallback to if width set too narrow
        paddingLeft: 0,
        paddingRight: 0,
        errorChar: "�",
        returnFormat: "string", // or 'array'
        skipPadding: false, // set to true when padding set too wide for line length
        splitAt: [" ", "\t"],
        trim: true,
        width: 10,
    };
};

function calculateSpaceRemaining(
    lineLength: number,
    spacesUsed: number,
    options: {
        breakWord: boolean;
        input: string[];
        minWidth: number;
        paddingLeft: number;
        paddingRight: number;
        errorChar: string;
        returnFormat: "string" | "array";
        skipPadding: boolean;
        splitAt: string[];
        trim: true;
        width: number;
    }
) {
    return Math.max(
        lineLength - spacesUsed - options.paddingLeft - options.paddingRight,
        0
    );
}
function validateInput(text: string, options?: WordWrapOptions) {
    let config = {
        breakWord: options?.breakWord || false,
        input: options?.input || [], // input string split by whitespace
        minWidth: options?.minWidth || 2, // fallback to if width set too narrow
        paddingLeft: options?.paddingLeft ||  0,
        paddingRight: options?.paddingRight || 0,
        errorChar: options?.errorChar || "�",
        returnFormat: options?.returnFormat || "string", // or 'array'
        skipPadding: options?.skipPadding || false, // set to true when padding set too wide for line length
        splitAt: options?.splitAt || [" ", "\t"],
        trim: options?.trim || true,
        width: options?.width || 10,
    };
    if (config.errorChar) {
        // only allow a single errorChar
        config.errorChar = config.errorChar.split("")[0];

        // errorChar must not be wide character
        if (wcwidth(config.errorChar) > 1)
            throw new Error(
                `Error character cannot be a wide character (${config.errorChar})`
            );
    }

    // make sure correct sign on padding
    config.paddingLeft = Math.abs(config.paddingLeft);
    config.paddingRight = Math.abs(config.paddingRight);

    let lineLength = config.width - config.paddingLeft - config.paddingRight;

    if (lineLength < config.minWidth) {
        // skip padding if lineLength too narrow
        config.skipPadding = true;
        lineLength = config.minWidth;
    }

    // to trim or not to trim...
    if (config.trim) {
        text = text.trim();
    }

    return { text, config, lineLength };
}
function wrap(input: string, options: WordWrapOptions) {
    let { text, config, lineLength } = validateInput(input, options);

    // array of characters split by whitespace and/or tabs
    let words = [];

    if (!config.breakWord) {
        // break string into words
        if (config.splitAt.indexOf("\t") !== -1) {
            // split at both spaces and tabs
            words = text.split(/ |\t/i);
        } else {
            // split at whitespace
            words = text.split(" ");
        }
    } else {
        // do not break string into words
        words = [text];
    }

    // remove empty array elements
    words = words.filter((val) => {
        if (val.length > 0) {
            return true;
        }
    });

    // assume at least one line
    let lines: any = [[]];

    let spaceRemaining, splitIndex, word;
    let currentLine = 0; // index of current line in 'lines[]'
    let spacesUsed = 0; // spaces used so far on current line

    while (words.length > 0) {
        spaceRemaining = calculateSpaceRemaining(
            lineLength,
            spacesUsed,
            config
        );
        word = words.shift() || "";
        let wordLength = wcwidth(word);

        switch (true) {
            // too long for an empty line and is a single character
            case lineLength < wordLength && Array.from(word).length === 1:
                words.unshift(config.errorChar);
                break;

            // too long for an empty line, must be broken between 2 lines
            case lineLength < wordLength:
                // break it, then re-insert its parts into words
                // so can loop back to re-handle each word
                splitIndex = breakword(word, lineLength);
                let splitWord = Array.from(word);
                words.unshift(splitWord.slice(0, splitIndex + 1).join(""));
                words.splice(1, 0, splitWord.slice(splitIndex + 1).join("")); // +1 for substr fn
                break;

            // not enough space remaining in line, must be wrapped to next line
            case spaceRemaining < wordLength:
                // add a new line to our array of lines
                lines.push([]);
                // note carriage to new line in counter
                currentLine++;
                // reset the spacesUsed to 0
                spacesUsed = 0;
            /* falls through */

            // fits on current line
            // eslint-disable-next-line
            default:
                // add word to line
                lines[currentLine].push(word);
                // reduce space remaining (add a space between words)
                spacesUsed += wordLength + 1;
        }
    }

    lines = lines.map((line: any) => {
        // restore spaces to line
        line = line.join(" ");

        // add padding to ends of line
        if (!config.skipPadding) {
            line =
                Array(config.paddingLeft + 1).join(" ") +
                line +
                Array(config.paddingRight + 1).join(" ");
        }

        return line;
    });

    return lines.join("\n");
}

function splitAnsiInput(text: string) {
    // get start and end positions for matches
    let matches: any = [];
    let textArr = Array.from(text);
    let textLength = textArr.length;
    let result;

    while ((result = ANSIPattern.exec(text)) !== null) {
        matches.push({
            start: result.index,
            end: result.index + result[0].length,
            match: result[0],
            length: result[0].length,
        });
    }

    if (matches.length < 1) return []; // we have no ANSI escapes, we're done here

    // add start and end positions for non matches
    matches = matches
        .reduce(
            (prev: any[], curr: { start: number }) => {
                // check if space exists between this and last match
                // get end of previous match
                let prevEnd = prev[prev.length - 1];

                if (prevEnd.end < curr.start) {
                    // insert placeholder
                    prev.push(
                        {
                            start: prevEnd.end,
                            end: curr.start,
                            length: curr.start - prevEnd.end,
                            expand: true,
                        },
                        curr
                    );
                } else {
                    prev.push(curr);
                }
                return prev;
            },
            [{ start: 0, end: 0 }]
        )
        .splice(1); // removes starting accumulator object

    // add trailing match if necessary
    let lastMatchEnd = matches[matches.length - 1].end;
    if (lastMatchEnd < textLength) {
        matches.push({
            start: lastMatchEnd,
            end: textLength,
            expand: true,
        });
    }

    let savedArr = matches
        .map(
            (match: {
                start: number;
                end: number | undefined;
                expand: any;
            }) => {
                let value = text.substring(match.start, match.end);
                return match.expand ? Array.from(value) : [value];
            }
        )
        .flat(2);

    return savedArr;
}
function restoreANSI(savedArr: string[], processedArr: string[]) {
    return processedArr
        .map((char) => {
            let result: any;

            if (char === "\n") {
                result = [char];
            } else {
                // add everything saved before character match
                let splicePoint =
                    savedArr.findIndex((element) => element === char) + 1;
                result = savedArr.splice(0, splicePoint);
            }

            // add all following, consecutive closing tags in case linebreak inerted next
            const ANSIClosePattern = "^\\x1b\\[([0-9]+)*m";
            const ANSICloseRegex = new RegExp(ANSIClosePattern); // eslint-disable-line no-control-regex
            const closeCodes = [
                "0",
                "21",
                "22",
                "23",
                "24",
                "25",
                "27",
                "28",
                "29",
                "39",
                "49",
                "54",
                "55",
            ];

            let match;
            while (
                savedArr.length &&
                (match = savedArr[0].match(ANSICloseRegex))
            ) {
                if (!closeCodes.includes(match[1])) break;
                result.push(savedArr.shift());
            }

            return result.join("");
        })
        .concat(savedArr);
}
export default function wrapText(text: string, options: WordWrapOptions) {
    // process each existing line separately to respect existing line breaks
    const processedLines = text
        .toString()
        .split("\n")
        .map((string) => {
            // save input ANSI escape codes to be restored later
            const savedANSI = splitAnsiInput(string);

            // strip ANSI
            string = stripansi(string);

            // add newlines to string
            string = wrap(string, options);

            // convert into array of characters
            let charArr = Array.from(string);

            // restore input ANSI escape codes
            charArr =
                savedANSI.length > 0
                    ? restoreANSI(savedANSI, charArr)
                    : charArr;

            // convert array of single characters into array of lines
            let outArr = charArr.join("").split("\n");

            return outArr;
        });

    return processedLines.flat(2)
}
