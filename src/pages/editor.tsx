import { useEffect, useState } from "react";
import parseQuery from "@lib/parseQuery";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Select from "react-select";
import styled from "styled-components";
import CardProvider from "src/components/CardProvider";
import { getTheme, getThemes, getThemesNameAndId } from "@lib/theme";
const EditorHeader = styled.nav`
    width: 100%;
`;

const typeOptions = [
    {
        value: "repo",
        label: "Repo Card",
    },
    {
        value: "user",
        label: "User Card",
    },
];

export default function EditorPage({
    query,
    themes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { q, tq } = parseQuery(query);
    const [theme, setTheme] = useState(tq?.toLowerCase() || "theme_default");
    const [queryString, setQueryString] = useState(q || "");
    useEffect(() => {
        console.log(theme);
        console.log(queryString);
    });

    const handleChange = (selectedOption: any) => {
        console.log("Option Selected", selectedOption.value);
        setTheme(selectedOption.value);
    };
    const handleChangeType = (selectedOption: any) => {
        console.log("Option Selected", selectedOption.value);
        setQueryString(selectedOption.value);
    };

    const options = themes.map((theme) => ({
        value: theme.identifier.toLowerCase(),
        label: theme.name,
    }));
    return (
        <>
            <EditorHeader>
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
                            /*   value={theme} */
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
                            /*   value={theme} */
                            onChange={handleChangeType}
                            options={typeOptions}
                        />
                    </li>
                </ul>
            </EditorHeader>

            <div>
                <CardProvider
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
                />
            </div>
        </>
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
