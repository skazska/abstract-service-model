import {IServiceListOptions, IService} from "./interface";

export * from "./interface";

export class Service implements IService {
    _options: object;

    constructor (options? :Object) {
        this._options = options;
    }

    async create (data :Object) :Promise<any> {
        return undefined;
    }

    async read (id :any) :Promise<any> {
        return undefined;
    }

    async update (id :any, data :Object) :Promise<any> {
        return undefined;
    }

    async delete (id :any) :Promise<any> {
        return undefined;
    }

    async list (options :IServiceListOptions) :Promise<any> {
        return undefined;
    }
}