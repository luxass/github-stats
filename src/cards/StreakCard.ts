import { DateTime } from "luxon";
import Fetcher from "@helpers/fetcher";
import { StreaksFetcherResponse } from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard from "./BaseCard";
import { getFallbackTheme } from "@lib/theme";
import { parseCalendar } from "@lib/parser";
import { parseImage } from "@lib/parser";

export default class StreakCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        return super.preprocess(query);
    }

    protected async fetch(): Promise<StreaksFetcherResponse> {
        const { username, url } = this.props;
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
            currentStreak: `${DateTime.fromISO(
                calendarData.current_streak_start
            )
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
            longestStreak: `${DateTime.fromISO(
                calendarData.longest_streak_start
            )
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

    protected render(data: StreaksFetcherResponse) {
        const {
            text,
            border,
            title,
            icon,
            tq,
            background,
            font,
            size,
            weight,
            textsize,
            titlesize,
            textweight,
            titleweight,
        } = this.props;
        const {
            calendar: { total_contribution, longest_streak, current_streak },
            currentStreak,
            longestStreak,
            firstContribution,
            base64,
        } = data;

        const design = getFallbackTheme(tq, {
            design: {
                title,
                icon,
                text,
                background,
                border,
            },
            text: {
                font,
                size,
                weight,
                title: {
                    size: titlesize,
                    weight: titleweight,
                },
                text: {
                    size: textsize,
                    weight: textweight,
                },
            },
        });

        return `
        <svg version="1.1"
        xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" font-size="${
            design.text.size
        }" font-family="${design.text.font}" font-weight="${
            design.text.weight
        }">
        <rect x="5" y="5" width="485" height="185" fill="${
            design.design.background
        }" stroke="${
            design.design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
        ${
            typeof base64 === "string"
                ? `              <clipPath id="background">
        <rect x="5" y="5" width="390" height="185" rx="6" />
    </clipPath>
    <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="185" />`
                : ""
        }
        <g>
            <g transform="translate(1, 48)">
                <text x="81.5" y="25" dy="0.25em" fill="${
                    design.design.title
                }" font-size="${design.text.title.size}" font-weight="${
            design.text.title.weight
        }" stroke-width="0" text-anchor="middle">
                    ${total_contribution}
                </text>
            </g>
            <g transform="translate(1, 84)">
    
                <text x="81.5" y="25" dy="0.25em" stroke-width="0" fill="${
                    design.design.text
                }" font-size="${design.text.text.size}" font-weight="${
            design.text.text.weight
        }" text-anchor="middle">
                    Total Contributions
                </text>
            </g>
            <g transform="translate(1, 114)">
                <rect width="163" height="50" stroke="none" fill="none"></rect>
                <text x="81.5" y="25" dy="0.25em" stroke-width="0" text-anchor="middle" fill="${
                    design.design.text
                }" font-size="${design.text.text.size}" font-weight="${
            design.text.text.weight
        }">
                    ${firstContribution} - Present
                </text>
            </g>
        </g>
        <line x1="330" y1="28" x2="330" y2="170" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${
            design.design.border
        }" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
        <g>
            <g transform="translate(166, 48)">
                <text x="81.5" y="25" dy="0.25em" fill="${
                    design.design.title
                }" font-size="${design.text.title.size}" font-weight="${
            design.text.title.weight
        }" stroke-width="0" text-anchor="middle">
                        ${current_streak}
                </text>
            </g>
            <g transform="translate(166, 108)">
                <text x="81.5" y="25" dy="0.25em" stroke-width="0" fill="${
                    design.design.text
                }" font-size="${design.text.text.size}" font-weight="${
            design.text.text.weight
        }" text-anchor="middle">
                        Current Streak
                </text>
            </g>
            <g transform="translate(166, 145)">
    
                <text x="81.5" y="13" dy="0.25em" fill="${
                    design.text
                }" font-size="${design.text.text.size}" font-weight="${
            design.text.text.weight
        }" stroke-width="0" text-anchor="middle">
                        ${currentStreak}
                </text>
            </g>
            <defs>
                <mask id="cut-off-area">
                    <rect x="0" y="0" width="500" height="500" fill="white"/>
                    <ellipse cx="247.5" cy="31" rx="13" ry="18"/>
                </mask>
            </defs>
            <circle cx="247.5" cy="71" r="40" mask="url(#cut-off-area)" fill="none" stroke="#fb8c00" stroke-width="5"/>
            <g>
                <path d=" M 235.5 19.5 L 259.5 19.5 L 259.5 43.5 L 235.5 43.5 L 235.5 19.5 Z " fill="none"/>
                <path d=" M 249 20.17 C 249 20.17 249.74 22.82 249.74 24.97 C 249.74 27.03 248.39 28.7 246.33 28.7 C 244.26 28.7 242.7 27.03 242.7 24.97 L 242.73 24.61 C 240.71 27.01 239.5 30.12 239.5 33.5 C 239.5 37.92 243.08 41.5 247.5 41.5 C 251.92 41.5 255.5 37.92 255.5 33.5 C 255.5 28.11 252.91 23.3 249 20.17 Z  M 247.21 38.5 C 245.43 38.5 243.99 37.1 243.99 35.36 C 243.99 33.74 245.04 32.6 246.8 32.24 C 248.57 31.88 250.4 31.03 251.42 29.66 C 251.81 30.95 252.01 32.31 252.01 33.7 C 252.01 36.35 249.86 38.5 247.21 38.5 Z " fill="#fb8c00"/>
            </g>
        </g>
        <line x1="165" y1="28" x2="165" y2="170" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${
            design.design.border
        }" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
        <g>
            <g transform="translate(331, 48)">
                <text x="81.5" y="25" dy="0.25em" stroke-width="0" text-anchor="middle" fill="${
                    design.design.title
                }" font-size="${design.text.title.size}" font-weight="${
            design.text.title.weight
        }">
                    ${longest_streak}
                </text>
            </g>
            <g transform="translate(331, 84)">
                <text x="81.5" y="25" dy="0.25em" stroke-width="0" text-anchor="middle" fill="${
                    design.text
                }" font-size="${design.text.text.size}" font-weight="${
            design.text.text.weight
        }">
                    Longest Streak
                </text>
            </g>
            <g transform="translate(331, 114)">
    
                <text x="81.5" y="25" dy="0.25em" fill="${
                    design.text
                }" font-size="${design.text.text.size}" font-weight="${
            design.text.text.weight
        }" stroke-width="0" text-anchor="middle">
                    ${longestStreak}
                </text>
            </g>
        </g>
    </svg>
        `;
    }
}
