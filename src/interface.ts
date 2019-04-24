import {IModelConstructor, IModel, IModelKey, IModelProperties} from "./model/interface";
import {IService} from "./service/interface";

export interface IQueryOptions {
    //TODO
}

export interface IQueryResult {
    items: IModel[];
    //TODO
}

export interface IServiceModel {
    /**
     * @property
     * holds key field names
     */
    readonly modelConstructor :IModelConstructor;

    /**
     * @property
     * holds key fields
     */
    readonly service :IService;

    load (key :IModelKey) :Promise<IModel>;

    query (options :IQueryOptions) :Promise<IQueryResult>;

    create (key :IModelKey, properties :IModelProperties) :Promise<IModel>;

    save (model :IModel) :Promise<IModel>;

    delete (key :IModelKey) :Promise<boolean>;
}

export interface IServiceModelConstructor {
    new (service :IService, modelConstructor? :IModelConstructor) :IServiceModel;
}