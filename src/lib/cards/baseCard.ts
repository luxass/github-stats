import { ThemeDesign } from "@lib/types";

export default abstract class BaseCard {
    design: ThemeDesign;

    constructor(design: ThemeDesign) {
        this.design = design;
    }

    abstract render(): string;
}
