import {ServiceInterface} from "./interface";

export * from "./interface";

export class Service implements ServiceInterface {
    _options: object;

    constructor (options: object) {
        this._options = options;
    }

    async create (data) {
        return undefined;
    }

    async read (id) {
        return undefined;
    }

    async update (id, data) {
        return undefined;
    }

    async delete (id) {
        return undefined;
    }

    async list (options) {
        return undefined;
    }
}