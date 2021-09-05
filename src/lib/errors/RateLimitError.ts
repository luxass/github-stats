export default class RateLimitError extends Error {
    constructor() {
        super("Over the limit of re-request");

        this.name = "RateLimitError";
    }
}
