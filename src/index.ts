import {ModelConstructor, ModelInterface, ModelKeyInterface, ModelPropertiesInterface} from "./model/interface";
import {ServiceInterface} from "./service/interface";
import {Model} from "./model";
import {ListOptionsInterface, ServiceModelInterface} from "./interface";

export * from "./interface";

export class ServiceModel implements ServiceModelInterface {
    _service :ServiceInterface;
    _modelConstructor :ModelConstructor;

    constructor (service :ServiceInterface, modelConstructor? :ModelConstructor) {
        this._service = service;
        if (!modelConstructor) {
            this._modelConstructor = Model;
        } else {
            this._modelConstructor = modelConstructor;
        }
    }

    get modelConstructor () :ModelConstructor {
        return this._modelConstructor;
    }

    get service () :ServiceInterface {
        return this._service;
    }

    model (data: any) :ModelInterface {
        let props = {... data};
        let key = this._modelConstructor.keyNames
            .reduce((key, name) => {
                key[name] = data[name];
                delete props[name];
                return key;
            }, {});
        return new this._modelConstructor(key, props);
    }

    async load (key :ModelKeyInterface) :Promise<ModelInterface> {
        let data = await this._service.read(key);
        return this.model(data);
    }

    async list (options :ListOptionsInterface) :Promise<Array<ModelInterface>> {
        let data = await this._service.list(options);
        return data.map(item => this.model(item));
    }

    create (key :ModelKeyInterface, properties :ModelPropertiesInterface) :Promise<ModelInterface> {
        let model = new this._modelConstructor(key, properties);
        return Promise.resolve(model);
    }

    async delete (key :ModelKeyInterface) :Promise<boolean> {
        let data = await this._service.delete(key);
        return data;
    }
}