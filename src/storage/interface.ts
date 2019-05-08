import {IModel, IModelKey, IModelProperties} from "../model";
import {INavigate} from "../navigate/interface";

export interface IExtractOptions {
}

export interface ILoadOptions {
}

export interface ISaveOptions {
}

export interface IEraseOptions {
}

export interface IExtractResult {
    list: Array<IModel>
}

export interface IStorage {

    load? (id :IModelKey, options?: ILoadOptions) :Promise<IModel>

    save? (id :IModelKey, data :IModelProperties, options?: ISaveOptions) :Promise<IModel>

    erase? (id :IModelKey, options?: IEraseOptions) :Promise<IModel>

    extract? (options :IExtractOptions) :Promise<IExtractResult>
}

export interface IServiceConstructor {
    new (options? :Object) :IStorage;
}