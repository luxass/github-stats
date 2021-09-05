import { ValueOfQuery, Maybe } from "@lib/types";

const isEmptyValue = (value: ValueOfQuery): boolean =>
    !value || value.length === 0;

export const toBoolean = (value: ValueOfQuery): Maybe<boolean> => {
    return value === "true" || value === "false"
        ? JSON.parse(value)
        : undefined;
};

export const toString = (value: ValueOfQuery): Maybe<string> => {
    if (isEmptyValue(value)) return undefined;
    const originalValue = Array.isArray(value) ? value[0] : value;

    return typeof originalValue === "string" ? originalValue : undefined;
};

export const toInteger = (value: ValueOfQuery = ""): Maybe<number> => {
    const number = parseInt(value.toString(), 10);
    return isNaN(number) ? undefined : number;
};

export const toFloatingNumber = (value: ValueOfQuery = ""): Maybe<number> => {
    const number = parseFloat(value.toString());

    return isNaN(number) ? undefined : number;
};

export const toStringArray = (value: ValueOfQuery): string[] => {
    if (isEmptyValue(value)) return [];

    const originalArray =
        (Array.isArray(value) ? value : value?.split?.(",")) ?? [];

    return originalArray.every((value) => typeof value === "string")
        ? originalArray
        : [];
};
