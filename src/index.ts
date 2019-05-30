import {IModel, IModelKey} from "./model";
import {IExtractOptions, IExtractResult, ILoadOptions, IStorage} from "./storage";
import {
    IASMListOptions,
    IServiceModel,
    IASMReadOptions,
    IASMCreateOptions,
    IASMUpdateOptions,
    IASMDeleteOptions
} from "./interface";

import {IFromModelOptions, IIOAdapter, IToModelOptions} from "./adapter-i-o";

export class ServiceModel implements IServiceModel {
    _storage :IStorage;
    _ioAdapter :IIOAdapter;

    constructor (storage :IStorage, ioAdapter :IIOAdapter) {
        this._storage = storage;
        this._ioAdapter = ioAdapter;
    }

    get ioAdapter () :IIOAdapter {
        return this._ioAdapter;
    }

    get storage () :IStorage {
        return this._storage;
    }

    /**
     * Reads item data from storage by key (possible with options)
     * @param key
     * @param options
     * @returns data loaded from storage by 'key'
     *
     * 'key' gets converted to IModelKey by ioAdapter and used for 'load' method of storage to get IModel, which then
     * gets converted to data by ioAdapter
     */
    async read (key :any, options? :any) :Promise<any> {
        //TODO adapter and storage options preparation
        let modelKey :IModelKey = this._ioAdapter.key(key, options);
        let model = await this._storage.load(modelKey, options);
        return this._ioAdapter.data(model, options);
    }

    /**
     * Reads items data from storage
     * @param options
     *
     *
     */
    async list (options :any) :Promise<any> {
        let listOptions = this._ioAdapter.listOptions(options);
        let result :IExtractResult = await this._storage.extract(listOptions);
        result.list = this._ioAdapter.listData(result.list, <IFromModelOptions>options);
        return result;
    }

    async create (data: any, key? :any, options? :IASMCreateOptions) :Promise<any> {
        let model = this._ioAdapter.model(key, data, options);
        model = await this._storage.save(model.key, model.properties, options);
        return this._ioAdapter.data(model, options);
    }

    async update (data:IModel, key :any, options? :IASMUpdateOptions) :Promise<IModel> {
        let model = this._ioAdapter.model(key, data, options);
        model = await this._storage.save(model.key, model.properties, options);
        return this._ioAdapter.data(model, options);
    }

    async delete (key :any, options? :IASMDeleteOptions) :Promise<any> {
        let data = await this._storage.erase(this._ioAdapter.key(key), options);
        return data;
    }

}
