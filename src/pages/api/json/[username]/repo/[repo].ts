import type { NextApiRequest, NextApiResponse } from "next";
import RepoCard from "@cards/RepoCard";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Content-Type", "application/json");

    res.status(200).send(await new RepoCard(req.query).renderJSON());
}
