import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "@lib/fetcher";
import { RepoNode, UserStats } from "@lib/types";
import { getDataFromNodes } from "@lib/utils";
import { parseCalendar } from "@lib/parser";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = req.query as { user: string };
    res.setHeader("Content-Type", "application/json");

    try {
        const userData = await request(`/users/${user}`).then((res) =>
            res.json()
        );

        const accountCreatedDate = new Date(userData["created_at"]);
        const currentYear = new Date();
        const calendars: any[] = [];
        for (
            let i = accountCreatedDate.getFullYear();
            i <= currentYear.getFullYear();
            i++
        ) {
            const calendar = await request(
                `https://github.com/users/${user}/contributions?to=${i}-12-31`
            ).then((res) => res.text());
            calendars.push(calendar);
        }
        return res.status(200).json({
            user: user,
            data: parseCalendar(calendars),
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                error: err.message,
            });
        }
        return console.error(err);
    }
}
