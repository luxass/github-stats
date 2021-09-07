import type { NextApiRequest, NextApiResponse } from "next";
import TypeCard from "@cards/TypeCard";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/json");

  res.status(200).send(await new TypeCard(req.query).renderJSON());
}
