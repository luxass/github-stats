import themes from "../../themes/themes.json";
import { Theme, ThemeDesign } from "./types";

export function getFallbackColor(
    color: string | undefined,
    fallbackColor: string
) {
    return color
        ? `${color.startsWith("#") ? "" : "#"}${color}`
        : fallbackColor;
}

export function getFallbackDesign(
    theme: string | undefined,
    overwriteDesign: ThemeDesign
): ThemeDesign {
    const defaultThemeObj = getTheme("THEME_DEFAULT")!;
    const selectedThemeObj =
        getTheme(theme || "THEME_DEFAULT") || defaultThemeObj!;

    const title = getFallbackColor(
        overwriteDesign.title || selectedThemeObj.design.title,
        defaultThemeObj.design.title!
    );
    const icon = getFallbackColor(
        overwriteDesign.icon || selectedThemeObj.design.icon,
        defaultThemeObj.design.icon!
    );
    const text = getFallbackColor(
        overwriteDesign.text || selectedThemeObj.design.text,
        defaultThemeObj.design.text!
    );
    const background = getFallbackColor(
        overwriteDesign.background || selectedThemeObj.design.background,
        defaultThemeObj.design.background!
    );
    const border = getFallbackColor(
        overwriteDesign.border || selectedThemeObj.design.border,
        defaultThemeObj.design.border!
    );
    return { title, icon, text, background, border };
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
