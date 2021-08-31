import fs from "fs";
import path from "path";
import { ExtendedTheme, Theme, ThemeDesign } from "./types";
import { isProd } from "./utils";

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

    let themes = fs
        .readdirSync(path.join(process.cwd(), "themes"))
        .filter((theme) => path.extname(theme) === ".json");
    return themes
        .map((theme) =>
            JSON.parse(
                fs.readFileSync(
                    path.join(process.cwd(), "themes", theme),
                    "utf-8"
                )
            )
        )
        .filter(
            (theme: Theme) =>
                theme.identifier.toLowerCase() === themeIdentifier.toLowerCase()
        )[0];
}

export function getThemes(): ExtendedTheme[] {
    console.log(__dirname);
    console.log(process.cwd());
    console.log(fs.readdirSync(path.join(process.cwd())))
    let themes = fs
        .readdirSync(path.join(process.cwd(), "themes"))
        .filter((theme) => path.extname(theme) === ".json");
    return themes.map((theme) => {
        const themeObj: Theme = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), "themes", theme), "utf-8")
        );
        return Object.assign(themeObj, {
            url: `${isProd()}/editor?tq=${themeObj.identifier}`,
        });
    });
}
