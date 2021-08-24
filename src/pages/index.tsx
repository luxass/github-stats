import RedirectButton from "../components/RedirectButton";
import Head from "next/head";
import styled from "styled-components";

const CenteredBoxWrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CenteredBox = styled.div`
    width: 500px;
    height: 250px;
    border: 2px solid rgba(0, 118, 255, 0.9);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    text-align: center;
    border-radius: 10px;
    padding: 1rem;
`;

export default function Home() {
    return (
        <>
            <Head>
                <title>GitHub Stats</title>
                <meta name="description" content="GitHub Stats" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CenteredBoxWrapper>
                <CenteredBox>
                    <h1>GitHub Stats Page</h1>
                    <RedirectButton goTo="https://github.com/deprecatedluxas/github-stats">
                        Go to github repo
                    </RedirectButton>
                </CenteredBox>
            </CenteredBoxWrapper>
        </>
    );
}
