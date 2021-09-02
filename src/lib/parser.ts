import { CalendarData } from "./types";

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
    /*     (
        [totalContributions] => 402
        [firstContribution] => 2018-06-30
        [longestStreak] => Array
            (
                [start] => 2021-08-24
                [end] => 2021-09-01
                [length] => 9
            )
    
        [currentStreak] => Array
            (
                [start] => 2021-08-24
                [end] => 2021-09-01
                [length] => 9
            )
    
    ) */

    const today = Object.keys(contributions)[Object.keys(contributions).length - 1];

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
export function parseCalendar2(calendarString: string) {
    let data: any = {
            last_year: 0,
            longest_streak: -1,
            longest_streak_range: [],
            current_streak: 0,
            current_streak_range: [],
            longest_break: -1,
            longest_break_range: [],
            current_break: 0,
            current_break_range: [],

            last_contributed: null,
        },
        updateLongestStreak = () => {
            if (data.current_streak > data.longest_streak) {
                data.longest_streak = data.current_streak;
                data.longest_streak_range[0] = data.current_streak_range[0];
                data.longest_streak_range[1] = data.current_streak_range[1];
            }
        },
        updateLongestBreak = () => {
            if (data.current_break > data.longest_break) {
                data.longest_break = data.current_break;
                data.longest_break_range[0] = data.current_break_range[0];
                data.longest_break_range[1] = data.current_break_range[1];
            }
        };

    calendarString
        .split("\n")
        .slice(2)
        .map((c) => c.trim())
        .forEach((c) => {
            if (c.startsWith("<g transform")) {
            }

            let level: any = c.match(/data-level="([0-9\-]+)"/i),
                date: any = c.match(/data-date="([0-9\-]+)"/),
                count: any = c.match(/data-count="([0-9]+)"/);
            level = level && level[1];
            date = date && date[1];
            count = count && +count[1];

            if (!level) {
                return;
            }

            let obj = {
                date: new Date(date),
                count: count,
                level,
            };

            if (data.current_streak === 0) {
                data.current_streak_range[0] = obj.date;
            }

            if (data.current_break === 0) {
                data.current_break_range[0] = obj.date;
            }

            if (obj.count) {
                ++data.current_streak;
                data.last_year += obj.count;
                data.last_contributed = obj.date;
                data.current_streak_range[1] = obj.date;

                updateLongestBreak();
                data.current_break = 0;
            } else {
                updateLongestStreak();
                data.current_streak = 0;

                ++data.current_break;
                data.current_break_range[1] = obj.date;
            }
        });

    updateLongestStreak();

    return data;
}
