import { BuildingBlock } from "@lib/types";
import styled from "styled-components";

const StyledBlock = styled.div``;

type BlockProps = {
    block: BuildingBlock;
};

export default function Block({ block }: BlockProps) {
    return <StyledBlock></StyledBlock>;
}
