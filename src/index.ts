import {IModel} from "./model";
import {ILoadOptions, IStorage} from "./storage";
import {
    IASMListOptions,
    IServiceModel,
    IASMReadOptions,
    IASMCreateOptions,
    IASMUpdateOptions,
    IASMDeleteOptions
} from "./interface";

import {IIOAdapter, IToModelOptions} from "./io-adapter";

export class ServiceModel implements IServiceModel {
    _service :IStorage;
    _ioAdapter :IIOAdapter;
    _navigator: INavigator;

    constructor (storage :IStorage, ioAdapter :IIOAdapter) {
        this._service = storage;
        this._ioAdapter = ioAdapter;
    }

    get ioAdapter () :IIOAdapter {
        return this._ioAdapter;
    }

    get storage () :IStorage {
        return this._service;
    }

    async read (key :any, options? :IASMReadOptions) :Promise<any> {
        let modelKey = this._ioAdapter.key(key, <IToModelOptions>options);
        let model = await this._service.load(modelKey, <ILoadOptions>options);
        return this._ioAdapter.data(model, options);
    }

    async list (options :IASMListOptions) :Promise<any> {
        let list = await this._service.extract(options);
        return this._ioAdapter.listData(list, options);
    }

    async create (data: any, key? :any, options? :IASMCreateOptions) :Promise<any> {
        let model = this._ioAdapter.model(key, data, options);
        model = await this._service.save(model.key, model.properties, options);
        return this._ioAdapter.data(model, options);
    }

    async update (data:IModel, key :any, options? :IASMUpdateOptions) :Promise<IModel> {
        let model = this._ioAdapter.model(key, data, options);
        model = await this._service.save(model.key, model.properties, options);
        return this._ioAdapter.data(model, options);
    }

    async delete (key :any, options? :IASMDeleteOptions) :Promise<any> {
        let data = await this._service.erase(this._ioAdapter.key(key), options);
        return data;
    }

}