import axios from "axios";
import { CalendarData } from "./types";

export async function parseImage(imageUrl: string | undefined) {
    if (typeof imageUrl === "undefined") {
        return undefined;
    }
    const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "binary").toString("base64");
}

export function parseCalendar(calendarString: string[]): CalendarData {
    let calendarData: CalendarData = {
        total_contribution: 0,
        first_contribution: "",
        longest_streak: 0,
        longest_streak_start: "",
        longest_streak_end: "",
        current_streak: 0,
        current_streak_start: "",
        current_streak_end: "",
    };
    const contributions: any = {};

    calendarString.forEach((calendar) => {
        const calendarLines = calendar.split("\n");

        calendarLines.forEach((line, index) => {
            const dateMatcher = line.match(/data-date="([0-9\-]{10})"/)!;
            const countMatcher = line.match(/data-count="(\d+?)"/)!;

            if (dateMatcher && countMatcher) {
                let date = dateMatcher[1];
                let count = parseInt(countMatcher[1]);
                const today = new Date().toISOString();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                if (
                    date <= today ||
                    (date === tomorrow.toISOString() && count > 0)
                ) {
                    // add contributions to the array
                    contributions[date] = count;
                }
            }
        });
    });

    const today =
        Object.keys(contributions)[Object.keys(contributions).length - 1];

    Object.keys(contributions).forEach((contribution) => {
        let count = contributions[contribution];
        calendarData.total_contribution += count;
        if (count > 0) {
            ++calendarData.current_streak;
            calendarData.current_streak_end = contribution;

            if (calendarData.current_streak === 1) {
                calendarData.current_streak_start = contribution;
            }
            if (!calendarData.first_contribution) {
                calendarData.first_contribution = contribution;
            }
            if (calendarData.current_streak > calendarData.longest_streak) {
                calendarData.longest_streak_start =
                    calendarData.current_streak_start;
                calendarData.longest_streak_end =
                    calendarData.current_streak_end;
                calendarData.longest_streak = calendarData.current_streak;
            }
        } else if (contribution !== today) {
            calendarData.current_streak = 0;
            calendarData.current_streak_start = today;
            calendarData.current_streak_end = today;
        }
    });

    return calendarData;
}
