import fs from "fs";
import path from "path";
import { ExtendedTheme, Theme } from "./types";
import { encode, isProd } from "./utils";

export function getThemesNameAndId() {
    let themes = fs
        .readdirSync(path.join(process.cwd(), "themes"))
        .filter((theme) => path.extname(theme) === ".json");
    return themes.map((theme) => {
        const themeObj: Theme = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), "themes", theme), "utf-8")
        );
        return {
            value: themeObj.identifier.toLowerCase(),
            label: themeObj.name,
        };
    });
}

export function getTheme(themeIdentifier: string): Theme {
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
        .filter((theme: Theme) => theme.identifier.toLowerCase() === themeIdentifier.toLowerCase())[0];
}

export function getThemes(): ExtendedTheme[] {
    let themes = fs
        .readdirSync(path.join(process.cwd(), "themes"))
        .filter((theme) => path.extname(theme) === ".json");
    return themes.map((theme) => {
        const themeObj: Theme = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), "themes", theme), "utf-8")
        );
        return Object.assign(themeObj, {
            url: `${isProd()}/editor?q=gg&tq=${themeObj.identifier}`,
        });
    });
}
