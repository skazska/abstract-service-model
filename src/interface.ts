import {IModelConstructor, IModel, IModelKey, IModelProperties} from "./model/interface";
import {IStorage} from "./storage/interface";

export interface IListOptions {
    //TODO
}

export interface IListResult {
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
    readonly storage :IStorage;

    load (key :IModelKey) :Promise<IModel>;

    list (options :IListOptions) :Promise<IListResult>;

    create (key :IModelKey, properties :IModelProperties) :Promise<IModel>;

    save (model :IModel) :Promise<IModel>;

    erase (key :IModelKey) :Promise<boolean>;
}

export interface IServiceModelConstructor {
    new (storage :IStorage, modelConstructor? :IModelConstructor) :IServiceModel;
}