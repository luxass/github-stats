import themes from "../../themes/themes.json";
import {
    FallbackDesign,
    FallbackText,
    Theme,
    ThemeDesign,
    ThemeText,
} from "./types";

export function getFallbackColor(
    color: string | undefined,
    fallbackColor: string
): string {
    return color
        ? `${color.startsWith("#") ? "" : "#"}${color}`
        : fallbackColor;
}

export function getFallbackFont(
    font: string | undefined,
    fallbackFont: string
): string {
    return font ? font : fallbackFont;
}

export function getFallbackSize(
    size: string | undefined,
    fallbackSize: string
): string {
    return size ? size : fallbackSize;
}

export function getFallbackWeight(
    weight: string | undefined,
    fallbackWeight: string
): string {
    return weight ? weight : fallbackWeight;
}

export function getFallbackDesign(
    theme: string | undefined,
    overwriteDesign: {
        odesign: ThemeDesign;
        otext: {
            family?: string;
            size?: string;
            weight?: string;
            title?: ThemeText;
            text?: ThemeText;
        };
    }
): {
    fdesign: FallbackDesign;
    ftext: FallbackText;
} {
    const defaultThemeObj = getTheme("THEME_DEFAULT")!;
    const selectedThemeObj =
        getTheme(theme || "THEME_DEFAULT") || defaultThemeObj!;

    const title = getFallbackColor(
        overwriteDesign.odesign.title || selectedThemeObj.design.title,
        defaultThemeObj.design.title!
    );
    const icon = getFallbackColor(
        overwriteDesign.odesign.icon || selectedThemeObj.design.icon,
        defaultThemeObj.design.icon!
    );
    const text = getFallbackColor(
        overwriteDesign.odesign.text || selectedThemeObj.design.text,
        defaultThemeObj.design.text!
    );
    const background = getFallbackColor(
        overwriteDesign.odesign.background ||
            selectedThemeObj.design.background,
        defaultThemeObj.design.background!
    );
    const border = getFallbackColor(
        overwriteDesign.odesign.border || selectedThemeObj.design.border,
        defaultThemeObj.design.border!
    );

    const family = getFallbackFont(
        overwriteDesign.otext.family || selectedThemeObj.text.family,
        defaultThemeObj.text.family!
    );

    const size = getFallbackSize(
        overwriteDesign.otext.size || selectedThemeObj.text.size,
        defaultThemeObj.text.size!
    );

    const weight = getFallbackWeight(
        overwriteDesign.otext.weight || selectedThemeObj.text.weight,
        defaultThemeObj.text.weight!
    );

    const titleSize = getFallbackSize(
        overwriteDesign.otext.title!.size || selectedThemeObj.text.title!.size,
        defaultThemeObj.text.title!.size!
    );
    const titleWeight = getFallbackWeight(
        overwriteDesign.otext.title!.weight ||
            selectedThemeObj.text.title!.weight,
        defaultThemeObj.text.title!.weight!
    );

    const textSize = getFallbackSize(
        overwriteDesign.otext.text!.size || selectedThemeObj.text.text!.size,
        defaultThemeObj.text.text!.size!
    );
    const textWeight = getFallbackWeight(
        overwriteDesign.otext.text!.weight ||
            selectedThemeObj.text.text!.weight,
        defaultThemeObj.text.text!.weight!
    );

    return {
        fdesign: { title, icon, text, background, border },
        ftext: {
            family,
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

export function getTheme(themeIdentifier: string): Theme | undefined {
    return themes.filter(
        (theme: Theme) =>
            theme.identifier.toLowerCase() === themeIdentifier.toLowerCase()
    )[0];
}

export function getThemes(): Theme[] {
    return themes;
}
