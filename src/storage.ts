import {Result} from "./result";
import {IError} from "./error";

export interface IStorageError extends IError {}
export interface IStorageConfig {}

export interface IStorage<K, P, D> {
    newKey?() :Promise<Result<K, IStorageError>>
    data(key:K, props: P) :Promise<Result<D, IStorageError>>
    load(key :K) :Promise<Result<D, IStorageError>>
    save(data :D) :Promise<Result<any, IStorageError>>
    erase(key :K) :Promise<Result<any, IStorageError>>
}
