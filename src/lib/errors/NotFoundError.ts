export default class NotFoundError extends Error {
    constructor() {
        super("Both the user and organization was not found");

        this.name = "NotFoundError";
    }
}
