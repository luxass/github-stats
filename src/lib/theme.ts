import themes from "../../themes/themes.json";
import {
    FallbackTheme,
    Theme,
    ThemeDesign,
    ThemeText,
} from "./types";

function getFallbackColor(
    color: string | undefined,
    fallbackColor: string
): string {
    return color
        ? `${color.startsWith("#") ? "" : "#"}${color}`
        : fallbackColor;
}

function getFallbackFont(
    font: string | undefined,
    fallbackFont: string
): string {
    return font ? font : fallbackFont;
}

function getFallbackSize(
    size: string | undefined,
    fallbackSize: string
): string {
    return size ? size : fallbackSize;
}

function getFallbackWeight(
    weight: string | undefined,
    fallbackWeight: string
): string {
    return weight ? weight : fallbackWeight;
}

export function getFallbackTheme(
    theme: string | undefined,
    overwriteThemeOptions: {
        design: ThemeDesign;
        text: ThemeText;
    }
): FallbackTheme {
    const defaultThemeObj = getTheme("THEME_DEFAULT")!;
    const selectedThemeObj =
        getTheme(theme || "THEME_DEFAULT") || defaultThemeObj!;

    const title = getFallbackColor(
        overwriteThemeOptions.design.title || selectedThemeObj.design!.title,
        defaultThemeObj.design!.title!
    );
    const icon = getFallbackColor(
        overwriteThemeOptions.design.icon || selectedThemeObj.design!.icon,
        defaultThemeObj.design!.icon!
    );
    const text = getFallbackColor(
        overwriteThemeOptions.design.text || selectedThemeObj.design!.text,
        defaultThemeObj.design!.text!
    );
    const background = getFallbackColor(
        overwriteThemeOptions.design.background ||
            selectedThemeObj.design!.background,
        defaultThemeObj.design!.background!
    );
    const border = getFallbackColor(
        overwriteThemeOptions.design.border || selectedThemeObj.design!.border,
        defaultThemeObj.design!.border!
    );

    const font = getFallbackFont(
        overwriteThemeOptions.text.font || selectedThemeObj.text!.font,
        defaultThemeObj.text!.font!
    );

    const size = getFallbackSize(
        overwriteThemeOptions.text.size || selectedThemeObj.text!.size,
        defaultThemeObj.text!.size!
    );

    const weight = getFallbackWeight(
        overwriteThemeOptions.text.weight || selectedThemeObj.text!.weight,
        defaultThemeObj.text!.weight!
    );

    const titleSize = getFallbackSize(
        overwriteThemeOptions.text.title!.size ||
            selectedThemeObj.text!.title!.size,
        defaultThemeObj.text!.title!.size!
    );
    const titleWeight = getFallbackWeight(
        overwriteThemeOptions.text.title!.weight ||
            selectedThemeObj.text!.title!.weight,
        defaultThemeObj.text!.title!.weight!
    );

    const textSize = getFallbackSize(
        overwriteThemeOptions.text.text!.size ||
            selectedThemeObj.text!.text!.size,
        defaultThemeObj.text!.text!.size!
    );
    const textWeight = getFallbackWeight(
        overwriteThemeOptions.text.text!.weight ||
            selectedThemeObj.text!.text!.weight,
        defaultThemeObj.text!.text!.weight!
    );

    return {
        design: { title, icon, text, background, border },
        text: {
            font,
            size,
            weight,
            title: {
                size: titleSize,
                weight: titleWeight,
            },
            text: {
                size: textSize,
                weight: textWeight,
            },
        },
    };
}

export function getTheme(identifier: string) {
    return themes.filter(
        (theme: Theme) =>
            theme.identifier.toLowerCase() === identifier.toLowerCase()
    )[0];
}

export function getThemes(): Theme[] {
    return themes;
}
