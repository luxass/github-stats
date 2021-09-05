import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import { graphql } from "@lib/fetcher";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
import { parseCalendar } from "@lib/parser";
import { ThemeDesign } from "@lib/types";
import LanguageCard from "@lib/cards/languageCard";
import defaultExport from "../../../../cards/LanguageCard";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user, tq, title, icon, text, background, border, use_fork } =
        parseQuery(req.query);

    const themeDesign: ThemeDesign = getFallbackDesign(tq, {
        title,
        icon,
        text,
        background,
        border,
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");
    try {
        return res
            .status(200)
            .send(await new defaultExport(req.query).renderSVGString());
    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .send(new ErrorCard(themeDesign, err.message).render());
        }
        return console.error(err);
    }
}
