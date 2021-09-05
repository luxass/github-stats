import type { NextApiRequest, NextApiResponse } from "next";
import LanguageCard from "@cards/LanguageCard";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");

    res.status(200).send(await new LanguageCard(req.query).renderSVGString());
}
