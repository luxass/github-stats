import styled from "styled-components";

const Pane = styled.div.attrs(({ width, flex }: PaneProps) => ({
    width: width,
    flex: flex,
}))`
    width: ${(props: PaneProps) => props.width};
    display: ${(props: PaneProps) => (props.flex ? "flex" : "block")};
    ${(props: PaneProps) =>
        props.flex
            ? `
            justify-content: center;
            align-items: center;
        `
            : ``}
`;

type PaneProps = {
    width: string;
    flex?: boolean;
    children?: React.ReactNode;
};
export default function EditorPane({ width, flex, children }: PaneProps) {
    return (
        <Pane width={width} flex={flex}>
            {children}
        </Pane>
    );
}
