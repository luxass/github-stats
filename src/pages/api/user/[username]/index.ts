import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import StatsCard from "@lib/cards/statsCard";
import { breakMultiLineText, getDataFromNodes } from "@lib/utils";
import { graphql } from "@lib/fetcher";
import { RepoNode, UserStats } from "@lib/types";
import defaultExport from "../../../../cards/StatsCard";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        user,
        tq,
        custom_title,
        hide_icons,
        title,
        icon,
        text,
        background,
        border,
    } = parseQuery(req.query);



    // Getting the fallback design
    const themeDesign = getFallbackDesign(tq, {
        title,
        icon,
        text,
        background,
        border,
    });


    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");

    try {
      

        return       res.status(200).send(await new defaultExport(req.query).renderSVGString());
    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .send(new ErrorCard(themeDesign, err.message).render());
        }

        return console.error(err);
    }
}
