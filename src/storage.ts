import {GenericResult} from "./result";
import {IError} from "./error";

export interface IStorageError extends IError {
    source? :any
}
export interface IStorageConfig {}

export interface IStorageOperationOptions {}

export interface IStorage<K, P, D> {
    newKey?(options?: IStorageOperationOptions) :Promise<GenericResult<K, IStorageError>>
    load(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<D, IStorageError>>
    save(data :D, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
    erase(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
}
