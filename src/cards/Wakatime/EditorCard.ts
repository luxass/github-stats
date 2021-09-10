import { toBoolean, toInteger, toString, toStringArray } from "@helpers/query";
import {
    EditorFetcherResponse,
    LanguageFetcherResponse,
    RepoNode,
    WakatimeEditor,
} from "@lib/types";
import { VercelRequestQuery } from "@vercel/node";
import BaseCard, { CommonProps } from "../BaseCard";
import { getFallbackTheme } from "@lib/theme";
import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import longLanguages from "@lib/languages";
import { parseImage } from "@lib/parser";

export default class WakatimeCard extends BaseCard {
    constructor(query: VercelRequestQuery) {
        super(query);
    }

    protected preprocess(query: VercelRequestQuery) {
        const commonProps: CommonProps = super.preprocess(query);

        return {
            ...commonProps,
        };
    }

    protected async fetch(): Promise<EditorFetcherResponse> {
        const { username, url } = this.props;
        const response = await Fetcher.requestOtherservice(
            `https://wakatime.com/api/v1/users/${username}/stats`
        );
        const editors: WakatimeEditor[] = response.data.data.editors;

        return {
            editors,
            base64: await parseImage(url),
        };
    }

    generateEditorColors(editorsLength: number): string[] {
        const colors: string[] = [];
        for (let i = 0; i < editorsLength; i++) {
            colors.push(
                `#${(Math.random() * 0xfffff * 1000000)
                    .toString(16)
                    .slice(0, 6)}`
            );
        }
        return colors;
    }

    protected render(data: EditorFetcherResponse) {
        const { editors, base64 } = data;

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
            titlesize,
            titleweight,
            textsize,
            textweight,
        } = this.props;

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

        const editorColors = this.generateEditorColors(editors.length);
        let totalPercent = 0;
        return `          
            <svg width="350" height="350" viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg" font-family="${
                design.text.font
            }" font-size="${design.text.size}" font-weight="${
            design.text.weight
        }">
                <rect x="5" y="5" width="340" height="340" fill="${
                    design.design.background
                }" stroke="${
            design.design.border
        }" stroke-width="1px" rx="6px" ry="6px" />
                     ${
                         typeof base64 === "string"
                             ? `              <clipPath id="background">
                <rect x="5" y="5" width="340" height="340" rx="6" />
            </clipPath>
            <image x="5" y="5" clip-path="url(#background)" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${base64}" width="390" height="340" />`
                             : ""
                     }

                     <svg cx="50%" cy="50%" class="recharts-surface" width="297" height="458" viewBox="0 0 297 458" version="1.1"><defs><clipPath id="recharts1-clip"><rect x="5" y="5" height="448" width="287"></rect></clipPath></defs><g class="recharts-layer recharts-pie"><g class="recharts-layer"><g class="recharts-layer recharts-pie-sector"><path name="Group A" cx="148.5" cy="229" fill="#0088FE" stroke="#fff" class="recharts-sector" d="M 228.5,229
                     A 80,80,0,
                     0,0,
                     108.50000000000001,159.7179676972449
                   L 148.5,229 Z"></path></g><g class="recharts-layer recharts-pie-sector"><path name="Group B" cx="148.5" cy="229" fill="#00C49F" stroke="#fff" class="recharts-sector" d="M 108.50000000000001,159.7179676972449
                     A 80,80,0,
                     0,0,
                     79.21796769724492,269
                   L 148.5,229 Z"></path></g><g class="recharts-layer recharts-pie-sector"><path name="Group C" cx="148.5" cy="229" fill="#FFBB28" stroke="#fff" class="recharts-sector" d="M 79.21796769724492,269
                     A 80,80,0,
                     0,0,
                     188.5,298.28203230275506
                   L 148.5,229 Z"></path></g><g class="recharts-layer recharts-pie-sector"><path name="Group D" cx="148.5" cy="229" fill="#FF8042" stroke="#fff" class="recharts-sector" d="M 188.5,298.28203230275506
                     A 80,80,0,
                     0,0,
                     228.5,229.00000000000003
                   L 148.5,229 Z"></path></g></g><g class="recharts-layer recharts-pie-labels"><g class="recharts-layer"><text x="168.5" y="194.35898384862247" fill="white" text-anchor="start" dominant-baseline="central">33%</text></g><g class="recharts-layer"><text x="109.86296694843728" y="218.64723819589915" fill="white" text-anchor="end" dominant-baseline="central">25%</text></g><g class="recharts-layer"><text x="138.14723819589918" y="267.63703305156275" fill="white" text-anchor="end" dominant-baseline="central">25%</text></g><g class="recharts-layer"><text x="183.14101615137753" y="249.00000000000003" fill="white" text-anchor="start" dominant-baseline="central">17%</text></g></g></g></svg>
            </svg>
        `;
    }
}

/* <g transform="translate(100, 100)">
<circle

  cx="0"
  cy="0"
  r="20"

  stroke-width="6"
  fill="none"
  style="opacity: 0.2;"

/>
${editors.map((editor: WakatimeEditor, index: number) => {
    const perimeter = Math.PI * (20 * 2);
    const prevPercent = totalPercent;
    totalPercent += editor.percent;
    const color = editorColors[index];
    return `
       <circle
           cx="0"
           cy="0"
           r="20"
           stroke-dasharray="${perimeter}"
           fill="none"
           stroke-width="6"
           stroke-linecap="${
               editors.length > 1 ? "unset" : "round"
           }"
           transform="rotate(${-90 + (prevPercent / 100) * 360}deg)"
           stroke="#2DB55D"
       />
    `;
}).join("")}
</g> */
