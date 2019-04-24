import {IModelConstructor, IModel, IModelKey, IModelProperties} from "./model/interface";
import {IService} from "./service/interface";
import {Model} from "./model";
import {IQueryResult, IQueryOptions, IServiceModel} from "./interface";

export * from "./interface";

export class ServiceModel implements IServiceModel {
    _service :IService;
    _modelConstructor :IModelConstructor;

    constructor (service :IService, modelConstructor? :IModelConstructor) {
        this._service = service;
        if (!modelConstructor) {
            this._modelConstructor = Model;
        } else {
            this._modelConstructor = modelConstructor;
        }
    }

    get modelConstructor () :IModelConstructor {
        return this._modelConstructor;
    }

    get service () :IService {
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

    async load (key :IModelKey) :Promise<IModel> {
        let data = await this._service.read(key);
        return this.model(data);
    }

    async query (options :IQueryOptions) :Promise<IQueryResult> {
        let data = await this._service.list(options);
        return {items: data.map(item => this.model(item))};
    }

    create (key :IModelKey, properties :IModelProperties) :Promise<IModel> {
        let model = new this._modelConstructor(key, properties);
        return Promise.resolve(model);
    }

    async delete (key :IModelKey) :Promise<any> {
        let data = await this._service.delete(key);
        return data;
    }

    async save (model :IModel) :Promise<IModel> {
        let data = await this._service.update(model.key, model.properties);
        return this.updateModel(model, data);
    }

}