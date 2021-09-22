import type { NextApiRequest, NextApiResponse } from "next";
import StatsCard from "@cards/stats";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");

    res.status(200).send(await new StatsCard(req.query).renderSVGString());
}
