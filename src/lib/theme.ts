import fs from "fs";
import path from "path";
import { ExtendedTheme } from "./types";
import { encode, isProd } from "./utils";

export function getThemes(): ExtendedTheme[] {
    let themes = fs
        .readdirSync(path.join(process.cwd(), "themes"))
        .filter((theme) => path.extname(theme) === ".json");
    return themes.map((theme) => {
        const themeObj = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), "themes", theme), "utf-8")
        );
        return Object.assign(themeObj, {
            url: `${isProd()}/editor?q=${encode(JSON.stringify(themeObj))}`,
        });
    });
}
