import {ModelConstructor, ModelInterface, ModelKeyInterface, ModelPropertiesInterface} from "./model/interface";
import {ServiceInterface} from "./service/interface";
import {Model} from "./model";
import {ServiceModelInterface} from "./interface";

export * from "./interface";

export class ServiceModel implements ServiceModelInterface {
    _service :ServiceInterface;
    _modelConstructor :ModelConstructor;

    constructor (service? :ServiceInterface, modelConstructor? :ModelConstructor) {
        this._service = service;
        if (!modelConstructor) {
            this._modelConstructor = Model;
        } else {
            this._modelConstructor = modelConstructor;
        }
    }

    get modelConstructor () {
        return this._modelConstructor;
    }

    get service () {
        return this._service;
    }

    async load (key) {
        return undefined;
    }

    async list (options) {
        return undefined;
    }

    create (key, properties) {
        return undefined;
    }

    delete (key) {
        return undefined;
    }
}