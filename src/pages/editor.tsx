import { useEffect, useState } from "react";
import parseQuery from "@lib/parseQuery";
import {
    InferGetServerSidePropsType,
    GetServerSidePropsContext,
    GetServerSideProps,
} from "next";

export default function EditorPage({
    query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { q, tq } = parseQuery(query);
    const [theme, setTheme] = useState(tq);
    const [queryString, setQueryString] = useState(q);

    useEffect(() => {
        console.log(theme);
        console.log(queryString);
    });
    return (
        <div>
            <h1>{JSON.stringify(query)}</h1>
            <h1>{JSON.stringify(theme)}</h1>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            query: context.query,
        },
    };
}
