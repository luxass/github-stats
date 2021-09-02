import { StatsCardOptions, ThemeDesign, UserStats } from "../types";
import BaseCard from "./baseCard";
export default class StreakCard extends BaseCard {
    constructor(design: ThemeDesign) {
        super(design);
    }

    render() {
        const { title, icon, border, background, text } = this.design;

        return `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji" font-size="14px">
                <rect x="5" y="5" width="485" height="185" fill="${background}" stroke="${border}" stroke-width="1px" rx="6px" ry="6px" />
                
                <g>
                    <g transform='translate(1,48)'>
                        
                        <text x='81.5' y="25" dy="0.25em" fill="${text}" stroke-width='0' text-anchor='middle'>
                            ${1}
                        </text>
                    </g>
                    <g transform='translate(1,84)'>
                    
                        <text x='81.5' y='25' dy='0.25em' stroke-width='0' fill="${text}" text-anchor='middle' >
                            Total Contributions
                        </text>
                    </g>
                    <!-- total contributions range -->
                    <g transform='translate(1,114)'>
                        <rect width='163' height='50' stroke='none' fill='none'></rect>
                        <text x='81.5' y='25' dy='0.25em' stroke-width='0' text-anchor='middle' fill="${text}">
                            ${"now"}
                        </text>
                    </g>
                </g>
                <line x1='330' y1='28' x2='330' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='${border}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
                <g>
                <g transform="translate(166,48)">
                <text x="81.5" y="25" dy="0.25em" fill="${text}" stroke-width="0" text-anchor="middle" >
                    9
                </text>
            </g>

            <!-- Current Streak Label -->
            <g transform="translate(166,108)">
                <text x="81.5" y="25" dy="0.25em" stroke-width="0" fill="${text}" text-anchor="middle" >
                    Current Streak
                </text>
            </g>

            <!-- Current Streak Range -->
            <g transform="translate(166,145)">
            
                <text x="81.5" y="13" dy="0.25em" fill="${text}" stroke-width="0" text-anchor="middle" >
                    Aug 24 - Sep 1
                </text>
            </g>

            <!-- mask for background behind fire -->
            <defs>
                <mask id="cut-off-area">
                <rect x="0" y="0" width="500" height="500" fill="white"/>
                <ellipse cx="247.5" cy="31" rx="13" ry="18"/>
                </mask>
            </defs>
            <!-- ring around number -->
            <circle cx="247.5" cy="71" r="40" mask="url(#cut-off-area)" fill="none" stroke="#fb8c00" stroke-width="5"/>
            <!-- fire icon -->
            <g>
                <path d=" M 235.5 19.5 L 259.5 19.5 L 259.5 43.5 L 235.5 43.5 L 235.5 19.5 Z " fill="none"/>
                <path d=" M 249 20.17 C 249 20.17 249.74 22.82 249.74 24.97 C 249.74 27.03 248.39 28.7 246.33 28.7 C 244.26 28.7 242.7 27.03 242.7 24.97 L 242.73 24.61 C 240.71 27.01 239.5 30.12 239.5 33.5 C 239.5 37.92 243.08 41.5 247.5 41.5 C 251.92 41.5 255.5 37.92 255.5 33.5 C 255.5 28.11 252.91 23.3 249 20.17 Z  M 247.21 38.5 C 245.43 38.5 243.99 37.1 243.99 35.36 C 243.99 33.74 245.04 32.6 246.8 32.24 C 248.57 31.88 250.4 31.03 251.42 29.66 C 251.81 30.95 252.01 32.31 252.01 33.7 C 252.01 36.35 249.86 38.5 247.21 38.5 Z " fill="#fb8c00"/>
            </g>
                </g>
                <line x1='165' y1='28' x2='165' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='${border}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
                <g>
                    <g transform="translate(331,48)">
                        <text x="81.5" y="25" dy="0.25em" stroke-width="0" text-anchor="middle" fill="${text}" >
                            9
                        </text>
                    </g>
                    <g transform="translate(331,84)">
                        <text x="81.5" y="25" dy="0.25em" stroke-width="0" text-anchor="middle" fill="${text}" >
                            Longest Streak
                        </text>
                    </g>
                    <g transform="translate(331,114)">
                        
                        <text x="81.5" y="25" dy="0.25em" fill="${text}" stroke-width="0" text-anchor="middle">
                            Aug 24 - Sep 1
                        </text>
                    </g>
                </g>             
            </svg>
        `;
    }
}
