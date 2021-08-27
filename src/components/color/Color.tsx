import React, { useState } from "react";
import styled from "styled-components";

const StyledColor = styled.div.attrs(
    (props: ColorProps & { focus: boolean }) => ({
        color: props.color,
        focus: props.focus,
    })
)`
    background-color: ${(props) => props.color};
    height: 20px;
    width: 20px;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    margin: 0 6px;
    outline: none;
    ${(props) => (props.focus ? `box-shadow: 0 0 4px ${props.color}` : "")}
`;

type ColorProps = {
    color: string;
    children?: React.ReactNode;
    onClick: Function;
    onHover: Function;
};

export default function Color({
    color,
    children,
    onClick,
    onHover,
}: ColorProps) {
    const [focus, setFocus] = useState<boolean>(false);

    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);

    const handleClick = (e: React.MouseEvent) => onClick(color, e);
    const handleKeyDown = (e: any) => e.keyCode === 13 && onClick(color, e);
    const handleHover = (e: any) => onHover(color, e);
    return (
        <span onFocus={handleFocus} onBlur={handleBlur}>
            <StyledColor
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                onMouseOver={handleHover}
                title={color}
                tabIndex={0}
                color={color}
                focus={focus}
            >
                {children}
            </StyledColor>
        </span>
    );
}
