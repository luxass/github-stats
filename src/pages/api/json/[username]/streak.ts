import type { NextApiRequest, NextApiResponse } from "next";
import StreakCard from "@cards/StreakCard";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=7200");

    res.status(200).send(await new StreakCard(req.query).renderJSON());
}
