import StatsCard from "../cards/StatsCard";
import RepoCard from "../cards/RepoCard";
import { ThemeDesigns } from "@lib/types";
type RendererProps = {
    designs: ThemeDesigns;
};
export default function Renderer({ designs }: RendererProps) {
    const statsDesign = designs.stats || {};
    const repoDesign = designs.repo || {};

    return (
        <>
            <StatsCard design={statsDesign} />
            <RepoCard design={repoDesign} />
        </>
    );
}
