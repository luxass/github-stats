export default function ErrorCard(error: string[]) {
    const height = (error.length > 1 ? 100 : 90) + error.length * 10;
    return `
    <svg width="350" height="${height}" viewBox="0 0 350 ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="349" height="99%" rx="4.5" fill="#FFFEFE" stroke="#E4E2E2"/>
        <text x="25" y="15" style="font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif;" fill="#2F80ED">
            <tspan x="25" dy="18">An error occurred</tspan>
            <tspan x="25" dy="18">Report at https://git.io/J0sDR</tspan>
        </text>
        <text x="25" y="65" style="font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif;" fill="#252525">
        ${error
            .map((line: string) => `<tspan dy="1.2em" x="25">${line}</tspan>`)
            .join("")}
        </text>
    </svg>
    `;
}
