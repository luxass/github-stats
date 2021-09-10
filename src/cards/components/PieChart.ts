import { getCartesian, getDelta } from "@lib/math";
import { PieChartData, PieChartObject } from "@lib/types";

export default function PieChart(
    { width, height }: { width: number; height: number },
    { data }: PieChartData
): string {
    const getSectorPath = ({
        cx,
        cy,
        innerRadius,
        outerRadius,
        start,
        end,
    }: {
        cx: number;
        cy: number;
        innerRadius: number;
        outerRadius: number;
        start: number;
        end: number;
    }): string => {
        const delta = getDelta(start, end);
        // When the angle of sector equals to 360, star point and end point coincide
        const tempEndAngle = start + delta;
        const outerStartPoint = getCartesian(cx, cy, outerRadius, start);
        const outerEndPoint = getCartesian(cx, cy, outerRadius, tempEndAngle);

        let path = `M ${outerStartPoint.x},${outerStartPoint.y}
    A ${outerRadius},${outerRadius},0,
    ${+(Math.abs(delta) > 180)},${+(start > tempEndAngle)},
    ${outerEndPoint.x},${outerEndPoint.y}
  `;

        if (innerRadius > 0) {
            const innerStartPoint = getCartesian(cx, cy, innerRadius, start);
            const innerEndPoint = getCartesian(
                cx,
                cy,
                innerRadius,
                tempEndAngle
            );
            path += `L ${innerEndPoint.x},${innerEndPoint.y}
            A ${innerRadius},${innerRadius},0,
            ${+(Math.abs(delta) > 180)},${+(start <= tempEndAngle)},
            ${innerStartPoint.x},${innerStartPoint.y} Z`;
        } else {
            path += `L ${cx},${cy} Z`;
        }

        return path;
    };
    const sector = (sec: PieChartObject) => {
        console.log(getSectorPath({
            cx: 148.5,
            cy: 229,
            innerRadius: 0,
            outerRadius: 80,
            
        }))
        return `
            <g>
                <path name="Group B" cx="148.5" cy="229" fill="${sec}" stroke="#fff" class="recharts-sector" d=""></path>
            </g>
        `;
    };
    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" cx="50%" cy="50%" version="1.1">
            <g>
                ${data.map((sec: PieChartObject) => sector(sec)).join("")}
            </g>
        </svg>
    `;
}
