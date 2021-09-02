import styled from "styled-components";
import { useState } from "react";
import Select from "react-select";
import { Theme } from "@lib/types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getThemes } from "@lib/theme";
import CardProvider from "../components/card/CardProvider";
import RepoCard from "../components/card/RepoCard";
import MarkdownPreview from "../components/MarkdownPreview";

const StyledWrapper = styled.div`
    margin: auto;
    max-width: 100%;
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 960px) {
        & div {
            width: 100%;
        }
    }
`;

const StyledOptions = styled.div`
    max-width: 550px;
    height: 400px;
    margin: 10px;
    background: #1f1f1f;
    padding: 25px;
    padding-top: 0;
    border-radius: 6px;
`;
const OptionsHeader = styled.h2`
    margin-top: 10px;
    text-align: center;
    color: #e4e2e2;
`;
const Divider = styled.div`
    height: 1px;
    background-color: #e4e2e2;
    border-radius: 1px;
    margin: 20px 0;
`;

const Input = styled.input`
    padding: 10px 14px;
    display: inline-block;
    border: 1px solid #cccccc;
    border-radius: 6px;
    box-sizing: border-box;
    font-family: inherit;
    background: white;
    width: 100%;
    color: inherit;
`;

const OptionsText = styled.p`
    color: #e4e2e2;
    margin-top: 10px;
    margin-bottom: 5px;
`;

const StyledPreview = styled.div`
    max-width: 550px;
    height: 400px;
    margin: 10px;
    background: #1f1f1f;
    padding: 25px;
    padding-top: 25px;
    padding-top: 0;
    border-radius: 6px;
`;

export default function Build({
    query,
    themes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [username, setUsername] = useState<string>("");
    const [repo, setRepo] = useState<string>("");

    const [card, setCard] = useState<string>("");
    const [theme, setTheme] = useState<string>("THEME_DEFAULT");

    const design = themes.filter((themeObj) => themeObj.identifier === theme)[0]
        .design;
    const themeOptions = themes.map((theme) => {
        return {
            value: theme.identifier,
            label: theme.name,
        };
    });
    return (
        <StyledWrapper>
            <StyledOptions>
                <OptionsHeader>Options</OptionsHeader>
                <Divider />
                <OptionsText>Card</OptionsText>
                <Select
                    options={[
                        { value: "streak", label: "Streak" },
                        { value: "repo", label: "Repo" },
                        { value: "stats", label: "Stats" },
                    ]}
                    defaultValue={{
                        value: "stats",
                        label: "Stats",
                    }}
                    onChange={(e) => setCard(e !== null ? e.value : "stats")}
                />

                <OptionsText>Username</OptionsText>
                <Input
                    type="text"
                    onChange={(event) => setUsername(event.target.value)}
                />
                {card && card === "repo" && (
                    <>
                        <OptionsText>Repo</OptionsText>
                        <Input
                            type="text"
                            onChange={(event) => setRepo(event.target.value)}
                        />
                    </>
                )}
                <OptionsText>Theme</OptionsText>
                <Select
                    options={themeOptions}
                    defaultValue={{
                        value: "THEME_DEFAULT",
                        label: "Default",
                    }}
                    onChange={(e) =>
                        setTheme(e !== null ? e.value : "THEME_DEFAULT")
                    }
                />
            </StyledOptions>
            <StyledPreview>
                <OptionsHeader>Preview</OptionsHeader>
                <Divider />

                <CardProvider design={design} card={"repo"} />

                <MarkdownPreview card={card} repo={repo} user={username} />
            </StyledPreview>
        </StyledWrapper>
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
