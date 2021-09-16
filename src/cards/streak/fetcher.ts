import Fetcher from "@helpers/fetcher";
import { parseCalendar, parseImage } from "@lib/parser";
import {
    StreaksFetcherResponse,
} from "@lib/types";
import { DateTime } from "luxon";

export default async function fetch(
    username: string,
    url?: string
): Promise<StreaksFetcherResponse> {
    const response = await Fetcher.request(`/users/${username}`);
    const accountCreatedYear: number = new Date(
        response.data.created_at
    ).getFullYear();
    const currentYear: number = new Date().getFullYear();

    const arrayOfCalendars: string[] = [];

    for (let i = accountCreatedYear; i <= currentYear; i++) {
        const calendarString = await Fetcher.request(
            `https://github.com/users/${username}/contributions?to=${i}-12-31`
        );
        arrayOfCalendars.push(calendarString.data);
    }

    const calendarData = parseCalendar(arrayOfCalendars);
    return {
        calendar: calendarData,
        currentStreak: `${DateTime.fromISO(calendarData.current_streak_start)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })} - ${DateTime.fromISO(calendarData.current_streak_end)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })}`,
        longestStreak: `${DateTime.fromISO(calendarData.longest_streak_start)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })} - ${DateTime.fromISO(calendarData.longest_streak_end)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })}`,
        firstContribution: DateTime.fromISO(calendarData.first_contribution)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        base64: await parseImage(url),
    };
}
