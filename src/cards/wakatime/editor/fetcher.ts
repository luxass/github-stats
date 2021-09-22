import Fetcher from "@helpers/fetcher";
import NotFoundError from "@lib/errors/NotFoundError";
import { parseImage } from "@lib/parser";
import {
    EditorFetcherResponse,
    RepoFetcherResponse,
    WakatimeEditor,
} from "@lib/types";

export default async function fetch(
    username: string,
    url?: string
): Promise<EditorFetcherResponse> {
    const response = await Fetcher.requestOtherservice(
        `https://wakatime.com/api/v1/users/${username}/stats`
    );
    const editors: WakatimeEditor[] = response.data.data.editors;

    return {
        editors,
        base64: await parseImage(url),
    };
}
