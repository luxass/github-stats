import { readdirSync, readFileSync } from "fs";
import { join, extname, basename } from "path";

export default function getIcons(): { [key: string]: string } {
    let icons: {
        [key: string]: string;
    } = {};

    try {
        const dirname: string = join("src", "icons", "octicons");
        const files: string[] = readdirSync(dirname);
        // Looping through the files
        files.forEach((fileName: string) => {
            try {
                if (extname(fileName) === ".svg") {
                    // Reading the file and getting the content
                    const fileContent: string = readFileSync(
                        join(dirname, fileName),
                        {
                            encoding: "utf8",
                        }
                    );
                    icons[basename(fileName, ".svg")] = fileContent;
                }
            } catch (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.error(err);
    }

    return icons;
}
