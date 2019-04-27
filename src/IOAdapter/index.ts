import {IModelConstructor, IModel, IModelKey, IModelProperties} from "./model/interface";
import {IStorage} from "./storage/interface";
import {Model} from "./model";
import {IListResult, IListOptions, IIOAdapter} from "./interface";

export * from "./interface";

export class ServiceModel implements IIOAdapter {
    _service :IStorage;
    _modelConstructor :IModelConstructor;

    constructor (storage :IStorage, modelConstructor? :IModelConstructor) {
        this._service = storage;
        if (!modelConstructor) {
            this._modelConstructor = Model;
        } else {
            this._modelConstructor = modelConstructor;
        }
    }

    get modelConstructor () :IModelConstructor {
        return this._modelConstructor;
    }

    get storage () :IStorage {
        return this._service;
    }

    protected model (data :any) :IModel {
        let props = {... data};
        let key = this._modelConstructor.keyNames
            .reduce((key, name) => {
                key[name] = data[name];
                delete props[name];
                return key;
            }, {});
        return new this._modelConstructor(key, props);
    }

    protected updateModel (model :IModel, data :any) :IModel {
        let props = {... data};
        this._modelConstructor.keyNames.forEach(name => { delete props[name]; });
        model.update(props);
        return model;
    }

    async read (key :IModelKey) :Promise<IModel> {
        let data = await this._service.load(key);
        return this.model(data);
    }

    async list (options :IListOptions) :Promise<IListResult> {
        let data = await this._service.extract(options);
        return {items: data.map(item => this.model(item))};
    }

    create (key :IModelKey, properties :IModelProperties) :Promise<IModel> {

        let model = new this._modelConstructor(key, properties);
        return Promise.resolve(model);
    }

    async delete (key :IModelKey) :Promise<any> {
        let data = await this._service.erase(key);
        return data;
    }

    async update (model :IModel) :Promise<IModel> {
        let data = await this._service.save(model.key, model.properties);
        return this.updateModel(model, data);
    }

}