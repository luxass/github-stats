import { useEffect, useState } from "react";
import parseQuery from "@lib/parseQuery";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Select from "react-select";
import styled from "styled-components";
import CardProvider from "src/components/CardProvider";
import { getTheme, getThemes, getThemesNameAndId } from "@lib/theme";
import EditorPane from "../components/editor/EditorPane";
import Renderer from "../components/editor/Renderer"
import { BuildingBlock } from "@lib/types";
const EditorWrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    background-color: purple;
`;

const EditorHeader = styled.div`
    width: 100%;
    height: 60px;
`;

const ShowIcons = styled.input`
    width: 100px;
`;


export default function EditorPage({
    query,
    themes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { q, tq } = parseQuery(query);
    const [theme, setTheme] = useState(tq?.toLowerCase() || "theme_default");

    const [blocks, setBlocks] = useState<BuildingBlock[]>([]);

    useEffect(() => {
        console.log(theme);
    });

    const handleChange = (selectedOption: any) => {
        console.log("Option Selected", selectedOption.value);
        setTheme(selectedOption.value);
    };

    const options = themes.map((theme) => ({
        value: theme.identifier.toLowerCase(),
        label: theme.name,
    }));

    const exportBlocksToTheme = () => {

    }
    return (
        <EditorWrapper>
            <EditorPane width={"300px"}>
                <h1>gdfg</h1>
                <button
                    onClick={() => {
                        setBlocks([
                            ...blocks,
                            {
                                type: "border",
                                value: "test",
                            },
                        ]);
                    }}
                >
                    create block
                </button>
                <ul>
                    {blocks.map((block, index) => {
                        return (
                            <li key={index}>
                                {block.type} | {block.value}
                            </li>
                        );
                    })}
                </ul>
            </EditorPane>
            <EditorPane width={"calc(100% - 300px)"} flex>
                <Renderer />
            </EditorPane>
            {/* Modal Renderer to popup with the exported blocks with a description on what to do */}
            {/*  <EditorHeader>
                <ul
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <li
                        style={{
                            width: "200px",
                        }}
                    >
                        <Select
                     
                            onChange={handleChange}
                            options={options}
                        />
                    </li>
                    <li
                        style={{
                            width: "200px",
                        }}
                    >
                        <Select
                           
                            onChange={handleChangeType}
                            options={typeOptions}
                        />
                    </li>
                </ul>
                <ShowIcons type="checkbox" />
            </EditorHeader> */}

            {/*         <CardProvider
                query={queryString}
                design={{
                    stats:
                        themes.filter(
                            (themeObj) =>
                                themeObj.identifier.toLowerCase() ===
                                theme.toLowerCase()
                        )[0].design.stats || {},
                    repo:
                        themes.filter(
                            (themeObj) =>
                                themeObj.identifier.toLowerCase() ===
                                theme.toLowerCase()
                        )[0].design.repo || {},
                }}
            /> */}
        </EditorWrapper>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            query: context.query,
            themes: getThemes(),
        },
    };
}
