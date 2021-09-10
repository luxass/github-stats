export const RADIAN = Math.PI / 180;

export function getDelta(start: number, end: number) {
    const sign = mathSign(end - start);
    return sign * Math.min(Math.abs(end - start), 360);
}

export function getCartesian(
    cx: number,
    cy: number,
    radius: number,
    angle: number
): {
    x: number;
    y: number;
} {
    return {
        x: cx + Math.cos(-RADIAN * angle) * radius,
        y: cy + Math.sin(-RADIAN * angle) * radius,
    };
}

export function mathSign(value: number) {
    if (value === 0) {
        return 0;
    }
    if (value > 0) {
        return 1;
    }

    return -1;
}
