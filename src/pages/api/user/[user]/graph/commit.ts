import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import StatsCard from "@lib/cards/statsCard";
import { breakMultiLineText, getDataFromNodes } from "@lib/utils";
import { graphql } from "@lib/fetcher";
import { RepoNode, UserStats } from "@lib/types";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
import LineGraph from "@lib/graphs/lineGraph";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        user,
        tq,
        type,
        title,
        icon,
        text,
        background,
        border,
    } = parseQuery(req.query);

    const themeDesign = getFallbackDesign(tq, {
        title,
        icon,
        text,
        background,
        border,
    });
    let graphType = type;
    if (!graphType) {
        graphType = "line";
    }
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");
    try {
        

        return res.status(200).send(new LineGraph(themeDesign).render())
    } catch (err) {
        return res
            .status(500)
            .send(new ErrorCard(themeDesign, err.message).render());
    }
}
