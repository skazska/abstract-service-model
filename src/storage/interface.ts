import {IModelKey, IModelProperties} from "../model";

export interface IExtractOptions {
}

export interface ILoadOptions {
}

export interface ISaveOptions {
}

export interface IEraseOptions {
}

export interface IStorage {

    load? (id :IModelKey, options?: ILoadOptions) :Promise<any>

    save? (id :IModelKey, data :IModelProperties, options?: ISaveOptions) :Promise<any>

    erase? (id :IModelKey, options?: IEraseOptions) :Promise<any>

    extract? (options :IExtractOptions) :Promise<any>
}

export interface IServiceConstructor {
    new (options? :Object) :IStorage;
}