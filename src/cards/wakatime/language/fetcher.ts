import Fetcher from "@helpers/fetcher";
import { parseImage } from "@lib/parser";
import { WakaLanguageFetcherResponse, WakatimeLanguage } from "@lib/types";

export default async function fetch(
    username: string,
    url?: string
): Promise<WakaLanguageFetcherResponse> {
    const response = await Fetcher.requestOtherservice(
        `https://wakatime.com/api/v1/users/${username}/stats`
    );
    const languages: WakatimeLanguage[] = response.data.data.languages;

    return {
        languages,
        base64: await parseImage(url),
    };
}
