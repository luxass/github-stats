import styled from "styled-components";

const StyledMarkdown = styled.pre`
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
    margin-right: 10px;

    & > code {
        display: inline;
        max-width: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: initial;
        border: 0;
    }
`;

const CopyButton = styled.button`
    text-decoration: none;
    color: #fff;
    background-color: #00a36c;
    border-color: #00a36c;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;

type MarkdownProps = {
    card: string;
    user: string;
    repo?: string;
};
export default function MarkdownPreview({ card, user, repo }: MarkdownProps) {
    let path = `/${card}`
    if (card === "repo") {
        path = `/repo/${repo}`;
    }
    const buildedString = `[![${user}' GitHub ${card}](https://gh-statistics.vercel.app/api/user/${user}${path})]`;

    return (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <StyledMarkdown>
                <code>{buildedString}</code>
            </StyledMarkdown>
            <CopyButton>Copy</CopyButton>
        </div>
    );
}
