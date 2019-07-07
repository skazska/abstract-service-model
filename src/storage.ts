import {GenericResult} from "./result";
import {IError} from "./error";

export interface IStorageError extends IError {
    source? :any
}
export interface IStorageConfig {}

export interface IStorage<K, P, D> {
    newKey?() :Promise<GenericResult<K, IStorageError>>
    data(key:K, props: P) :Promise<GenericResult<D, IStorageError>>
    load(key :K) :Promise<GenericResult<D, IStorageError>>
    save(data :D) :Promise<GenericResult<any, IStorageError>>
    erase(key :K) :Promise<GenericResult<any, IStorageError>>
}
