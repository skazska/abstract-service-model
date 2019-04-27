import {IEraseOptions, IExtractOptions, ILoadOptions, ISaveOptions, IStorage} from "./interface";
import {IModelKey, IModelProperties} from "../model";

export * from "./interface";

export class Service implements IStorage {
    _options: object;

    constructor (options? :Object) {
        this._options = options;
    }

    async load (id :IModelKey, options?: ILoadOptions) :Promise<any> {
        return undefined;
    }

    async save (id: IModelKey, data :IModelProperties, options?: ISaveOptions) :Promise<any> {
        return undefined;
    }

    async erase (id :any, options? :IEraseOptions) :Promise<any> {
        return undefined;
    }

    async extract (options :IExtractOptions) :Promise<any> {
        return undefined;
    }
}