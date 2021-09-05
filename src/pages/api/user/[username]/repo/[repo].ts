import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import RepoCard from "@lib/cards/repoCard";
import { graphql } from "@lib/fetcher";
import { RepoStats } from "@lib/types";
import { breakMultiLineText } from "@lib/utils";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
import wordwrap from "@lib/wordwrap";
import wcwidth from "wcwidth";
import defaultExport from "../../../../../cards/RepoCard";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        username,
        repo,
        tq,
        hide_owner,
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
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");
    try {

        // const repoData: RepoStats = {
        //     name:
        //         wcwidth(name) >= 32
        //             ? name.substring(0, 32 / wcwidth(name.substring(0, 1))) +
        //               "..."
        //             : name,
        //     description: wordwrap(description, {
        //         width: 50,
        //         breakWord: false,
        //     }),
        //     language: language,
        //     stars: stars,
        //     forks: forks,
        // };

        return res.status(200).send(await new defaultExport(req.query).renderSVGString());

    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .send(new ErrorCard(themeDesign, err.message).render());
        }
        return console.error(err);
    }
}
