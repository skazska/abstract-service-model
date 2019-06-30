import {Result} from "./result";
import {IError} from "./error";

export interface IStorageError extends IError {}
export interface IStorageConfig {}

export interface IStorage<K, P> {
    newKey?() :Promise<Result<K, IStorageError>>
    load(key :K) :Promise<Result<P, IStorageError>>
    save(data :P, key? :K) :Promise<Result<any, IStorageError>>
    erase(key :K) :Promise<Result<any, IStorageError>>
}
