import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
        font-family: Arial, sans-serif;
    }
`;
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    );
}
export default MyApp;
