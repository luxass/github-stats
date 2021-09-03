import { DateTime } from "luxon";
import {
    CalendarData,
    StatsCardOptions,
    ThemeDesign,
    UserStats,
} from "../types";
import BaseCard from "./baseCard";
export default class LanguageCard extends BaseCard {
    data: CalendarData;
    constructor(design: ThemeDesign, data: CalendarData) {
        super(design);
        this.data = data;
    }

    render() {
        const { title, icon, border, background, text } = this.design;
        const {
            total_contribution,
            first_contribution,
            longest_streak,
            longest_streak_start,
            longest_streak_end,
            current_streak,
            current_streak_start,
            current_streak_end,
        } = this.data;

        const currentStreak = `${DateTime.fromISO(current_streak_start)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })} - ${DateTime.fromISO(current_streak_end)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })}`;

        const longestStreak = `${DateTime.fromISO(longest_streak_start)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })} - ${DateTime.fromISO(longest_streak_end)
            .setLocale("en-US")
            .toLocaleString({
                month: "short",
                day: "numeric",
            })}`;
        return `
        <svg width="350" height="165" viewBox="0 0 350 165" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          .header {
            font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #2f80ed;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
          }
          .lang-name { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: #333 }

    /* Animations */
    @keyframes scaleInAnimation {
      from {
        transform: translate(-5px, 5px) scale(0);
      }
      to {
        transform: translate(-5px, 5px) scale(1);
      }
    }
    @keyframes fadeInAnimation {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

          * { animation-duration: 0s !important; animation-delay: 0s !important; }
        </style>

        <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="349" fill="#fffefe" stroke-opacity="1"/>

      <g data-testid="card-title" transform="translate(25, 35)">
        <g transform="translate(0, 0)">
      <text x="0" y="0" class="header" data-testid="header">Most Used Languages</text>
    </g>
      </g>

        <g data-testid="main-card-body" transform="translate(0, 55)">

    <svg data-testid="lang-items" x="25">

    <mask id="rect-mask">
      <rect x="0" y="0" width="300" height="8" fill="white" rx="5"/>
    </mask>

        <rect mask="url(#rect-mask)" data-testid="lang-progress" x="0" y="0" width="255.63" height="8" fill="#2b7489"/>

        <rect mask="url(#rect-mask)" data-testid="lang-progress" x="255.63" y="0" width="20.69" height="8" fill="#f1e05a"/>

        <rect mask="url(#rect-mask)" data-testid="lang-progress" x="276.32" y="0" width="19.4" height="8" fill="#3572A5"/>

        <rect mask="url(#rect-mask)" data-testid="lang-progress" x="285.71999999999997" y="0" width="18.5" height="8" fill="#c6538c"/>

        <rect mask="url(#rect-mask)" data-testid="lang-progress" x="294.21999999999997" y="0" width="15.780000000000001" height="8" fill="#563d7c"/>

    <g transform="translate(0, 25)">
      <circle cx="5" cy="6" r="5" fill="#2b7489"/>
      <text data-testid="lang-name" x="15" y="10" class="lang-name">
        TypeScript 85.21%
      </text>
    </g>

    <g transform="translate(150, 25)">
      <circle cx="5" cy="6" r="5" fill="#f1e05a"/>
      <text data-testid="lang-name" x="15" y="10" class="lang-name">
        JavaScript 6.90%
      </text>
    </g>

    <g transform="translate(0, 50)">
      <circle cx="5" cy="6" r="5" fill="#3572A5"/>
      <text data-testid="lang-name" x="15" y="10" class="lang-name">
        Python 3.13%
      </text>
    </g>

    <g transform="translate(150, 50)">
      <circle cx="5" cy="6" r="5" fill="#c6538c"/>
      <text data-testid="lang-name" x="15" y="10" class="lang-name">
        Game Maker Language 2.83%
      </text>
    </g>

    <g transform="translate(0, 75)">
      <circle cx="5" cy="6" r="5" fill="#563d7c"/>
      <text data-testid="lang-name" x="15" y="10" class="lang-name">
        CSS 1.93%
      </text>
    </g>

    </svg>

        </g>
      </svg>

        `;
    }
}
