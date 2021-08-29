import RedirectButton from "../components/RedirectButton";
import Head from "next/head";
import styled from "styled-components";

const CenteredBoxWrapper = styled.div`
    background-color: #111111;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CenteredBox = styled.div`
    width: 500px;
    height: 250px;
    background-color: #1f1f1f;
    border: 1px solid #00a36c;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
    text-align: center;
    border-radius: 10px;
    padding: 1rem;
`;

const H1 = styled.h1`
    color: white;
    margin: 10px 0 30px 0;
`;

const Description = styled.p`
    color: gray;
    margin: 10px 0;
    font-style: italic;
`;

export default function Home() {
    return (
        <>
            <Head>
                <title>GitHub Stats</title>
                <meta name="description" content="GitHub Stats" />
                <link rel="alternate icon" type="image/svg" href="/favicon.svg" />
            </Head>
            <CenteredBoxWrapper>
                <CenteredBox>
                    <H1>GitHub Stats Home Page</H1>
                    <Description>
                        Not special here, go to our GitHub Repo for magic ✨
                    </Description>
                    <RedirectButton goTo="https://github.com/deprecatedluxas/github-stats">
                        Checkout GitHub Repo ✨
                    </RedirectButton>
                </CenteredBox>
            </CenteredBoxWrapper>
        </>
    );
}
