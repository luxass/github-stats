import type { NextApiRequest, NextApiResponse } from "next";
import StatsCard from "@cards/StatsCard";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Content-Type", "application/json");

    res.status(200).send(await new StatsCard(req.query).renderJSON());
}
