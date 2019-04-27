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
     * holds key fields
     */
    readonly storage :IStorage;

    read (key :any) :Promise<any>;

    list(options :any) :Promise<any>;

    create (data :any, key? :any) :Promise<any>;

    update (key :any, data :any) :Promise<IModel>;

    delete (key :any) :Promise<any>;
}

export interface IServiceModelConstructor {
    new (storage :IStorage, modelConstructor? :IModelConstructor) :IServiceModel;
}