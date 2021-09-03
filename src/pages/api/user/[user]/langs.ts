import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCard from "@lib/cards/errorCard";
import { request } from "@lib/fetcher";
import parseQuery from "@lib/parseQuery";
import { getFallbackDesign } from "@lib/theme";
import StreakCard from "@lib/cards/streakCard";
import fs from "fs";
import { parseCalendar, parseCalendar2 } from "@lib/parser";
import { ThemeDesign } from "@lib/types";
import LanguageCard from "@lib/cards/languageCard";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        user,
        tq,
        title,
        icon,
        text,
        background,
        border,
    } = parseQuery(req.query);

    const themeDesign: ThemeDesign = getFallbackDesign(tq, {
        title,
        icon,
        text,
        background,
        border,
    });

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200");
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


        return res.status(200).send(new LanguageCard(themeDesign, parseCalendar(calendars)).render());
    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .send(new ErrorCard(themeDesign, err.message).render());
        }
        return console.error(err);
    }
}