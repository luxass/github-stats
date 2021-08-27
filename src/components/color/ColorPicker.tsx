import { useState } from "react";
import Color from "./Color";
import styled from "styled-components";
import { getColorConstrast } from "@lib/utils";

const ColorPickerBody = styled.div`
    padding: 10px;
    display: flex;
    width: 100%;
    height: 100%;
`;
const ColorPickerCard = styled.div`
    width: 170px;
    background-color: #fff;
    box-shadow: 0 1px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    height: 200px;
`;

const ColorPickerHead = styled.div.attrs((props: { color: string }) => ({
    color: props.color,
}))`
    background-color: ${(props) => props.color};
    height: 110px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: ${(props) => getColorConstrast(props.color)};
`;

export default function ColorPicker() {
    const [color, setColor] = useState<string>("#fff");
    const colors = [
        "#d9e3f0",
        "#f47373",
        "#697689",
        "#37d67a",
        "#2ccce4",
        "#555555",
        "#dce775",
        "#ff8a65",
        "#ba68c8",
    ];
    return (
        <ColorPickerCard>
            <ColorPickerHead color={color}>
                <span>{color}</span>
            </ColorPickerHead>
            <ColorPickerBody>
                {colors &&
                    colors.map((color, index) => (
                        <Color
                            key={index}
                            color={color}
                            onClick={() => {
                                setColor(color);
                            }}
                            onHover={() => {
                                console.log(color);
                            }}
                        />
                    ))}
            </ColorPickerBody>
        </ColorPickerCard>
    );
}
