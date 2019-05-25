import {Result} from "./result";
import {IError} from "./error";
import {IModel, IModelKey, IModelProperties} from "./model";

export interface IStorageError extends IError {}

export interface IStorage<P, D> {
    create(data: IModelProperties, key?: IModelKey): IModel
    load(params :P) :Promise<Result<D, IStorageError>>
    save(data :D) :Promise<Result<any, IStorageError>>
    erase(params :P) :Promise<Result<any, IStorageError>>
}
