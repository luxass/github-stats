import type { NextApiRequest, NextApiResponse } from "next";
import RepoCard from "@cards/RepoCard";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");

    res.status(200).send(await new RepoCard(req.query).renderSVGString());
}
